const scriptUrl = document.currentScript?.src;
const blogDirectory = scriptUrl
  ? new URL("../../blog/", scriptUrl)
  : new URL("./", window.location.href);
const postsIndexUrl = new URL("posts.json", blogDirectory);
const postsDirectory = new URL("posts/", blogDirectory);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatInlineMarkdown = (value) =>
  escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

const parsePost = (source, filename) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename} is missing front matter.`);

  const metadata = Object.fromEntries(
    match[1].split(/\r?\n/).map((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return [line.trim(), ""];
      return [
        line.slice(0, separator).trim(),
        line.slice(separator + 1).trim(),
      ];
    }),
  );

  if (!metadata.title || !metadata.description || !metadata.date) {
    throw new Error(`${filename} needs title, description, and date.`);
  }

  return {
    ...metadata,
    filename,
    slug: filename.replace(/\.md$/, ""),
    body: match[2].trim(),
  };
};

const parseDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(parseDate(date));

const renderMarkdown = (markdown) => {
  const html = [];
  let paragraph = [];
  let listType = null;
  const closeParagraph = () => {
    if (paragraph.length)
      html.push(`<p>${formatInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listType) html.push(`</${listType}>`);
    listType = null;
  };

  markdown.split(/\r?\n/).forEach((line) => {
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    const listItem = line.match(/^[-*]\s+(.+)$/);
    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`);
    } else if (listItem || orderedItem) {
      closeParagraph();
      const nextListType = orderedItem ? "ol" : "ul";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        html.push(`<${listType}>`);
      }
      html.push(
        `<li>${formatInlineMarkdown((listItem || orderedItem)[1])}</li>`,
      );
    } else if (!line.trim()) {
      closeParagraph();
      closeList();
    } else {
      closeList();
      paragraph.push(line.trim());
    }
  });
  closeParagraph();
  closeList();
  return html.join("\n");
};

const loadPosts = async () => {
  const response = await fetch(postsIndexUrl);
  if (!response.ok) throw new Error("The post list could not be loaded.");
  const filenames = await response.json();
  const posts = await Promise.all(
    filenames.map(async (filename) => {
      const postResponse = await fetch(new URL(filename, postsDirectory));
      if (!postResponse.ok) throw new Error(`${filename} could not be loaded.`);
      return parsePost(await postResponse.text(), filename);
    }),
  );
  return posts.sort(
    (first, second) => parseDate(second.date) - parseDate(first.date),
  );
};

const showError = (container, message) => {
  container.innerHTML = `<p class="empty-state">${escapeHtml(message)}</p>`;
};

const postUrl = (slug) => {
  const postPage = new URL("post.html", blogDirectory);
  return `${postPage.pathname}#${encodeURIComponent(slug)}`;
};

const requestedPostSlug = () => {
  const querySlug = new URLSearchParams(window.location.search).get("post");
  if (querySlug) return querySlug;
  const hashSlug = decodeURIComponent(window.location.hash.slice(1));
  if (hashSlug) return hashSlug;
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  return pathParts[pathParts.length - 2] === "post"
    ? pathParts[pathParts.length - 1]
    : null;
};

const renderArchive = (container, posts) => {
  container.innerHTML = posts
    .map(
      (post) => `
    <li>
      <a class="post-card" href="${escapeHtml(postUrl(post.slug))}">
        <h2>${escapeHtml(post.title)}</h2>
        <p>${escapeHtml(post.description)}</p>
        <p class="post-meta">
          <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
          <span>${escapeHtml(post.readTime || "")}</span>
        </p>
      </a>
    </li>
  `,
    )
    .join("");
};

const renderArticle = (container, post) => {
  const title = container.querySelector("[data-post-title]");
  const description = container.querySelector("[data-post-description]");
  const date = container.querySelector("[data-post-date]");
  const readTime = container.querySelector("[data-post-read-time]");
  const content = container.querySelector("[data-post-content]");
  if (title) title.textContent = post.title;
  if (description) description.textContent = post.description;
  if (date) {
    date.dateTime = post.date;
    date.textContent = formatDate(post.date);
  }
  if (readTime) readTime.textContent = post.readTime || "";
  if (content) content.innerHTML = renderMarkdown(post.body);
};

const archive = document.querySelector("[data-blog-archive]");
const article = document.querySelector("[data-blog-article]");

loadPosts()
  .then((posts) => {
    if (archive) renderArchive(archive, posts);
    if (article) {
      const post = posts.find(({ slug }) => slug === requestedPostSlug());
      if (post) renderArticle(article, post);
      else showError(article, "That post could not be found.");
    }
  })
  .catch((error) => {
    if (archive) showError(archive, error.message);
    if (article) showError(article, error.message);
  });
