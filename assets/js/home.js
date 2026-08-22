const highlightedRepositories = [
  {
    url: "https://github.com/xVlkan7/drone-proj",
    visibleTitle: "Drone Project",
  },
  {
    url: "https://github.com/xVlkan7/baseball-website",
    visibleTitle: "Baseball Website",
  },
];
const username = "xVlkan7";
const repositoryContainer = document.querySelector("[data-repositories]");
const activityContainer = document.querySelector("[data-github-activity]");
const contactButton = document.querySelector("[data-contact-download]");

if (contactButton) {
  contactButton.addEventListener("click", () => {
    const contact = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Adrian Zeni",
      "N:Zeni;Adrian;;;",
      "EMAIL;TYPE=INTERNET:azeni7@outlook.com",
      "URL:https://github.com/xVlkan7",
      "END:VCARD",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([contact], { type: "text/vcard" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "adrian-zeni.vcf";
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (
  repositoryContainer &&
  !highlightedRepositories.some((repository) => repository.url)
) {
  repositoryContainer.innerHTML =
    '<p class="loading-message">Add a GitHub repository link in <code>assets/js/home.js</code>.</p>';
}

if (activityContainer) {
  const profileLink = document.createElement("a");
  profileLink.className = "activity-card";
  profileLink.href = `https://github.com/${username}`;
  profileLink.target = "_blank";
  profileLink.rel = "noopener noreferrer";
  profileLink.setAttribute("aria-label", "View GitHub profile");
  profileLink.textContent = "View GitHub activity";
  activityContainer.replaceWith(profileLink);
}

const createCard = (repository, highlightedRepository) => {
  const card = document.createElement("a");
  card.className = "repository-card";
  card.href = repository.html_url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const title = document.createElement("h3");
  title.textContent = highlightedRepository.visibleTitle || repository.name;
  const description = document.createElement("p");
  description.textContent =
    repository.description || "Explore this project on GitHub.";
  const link = document.createElement("span");
  link.className = "card-link";
  link.textContent = repository.stargazers_count
    ? `View repository (${repository.stargazers_count} stars)`
    : "View repository";

  card.append(title, description, link);
  return card;
};

const loadRepository = ({ url: highlightedRepositoryUrl }) => {
  let repositoryApiUrl;
  try {
    const repositoryUrl = new URL(highlightedRepositoryUrl);
    const repositoryPath = repositoryUrl.pathname.split("/").filter(Boolean);
    if (
      !/^www\.github\.com$|^github\.com$/i.test(repositoryUrl.hostname) ||
      repositoryPath.length < 2
    ) {
      throw new Error("Invalid GitHub repository URL.");
    }
    repositoryApiUrl = `https://api.github.com/repos/${repositoryPath[0]}/${repositoryPath[1]}`;
  } catch {
    return Promise.resolve({
      html_url: highlightedRepositoryUrl,
      name: "Highlighted work",
      description: "Explore this project on GitHub.",
    });
  }

  return fetch(repositoryApiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("GitHub repository is unavailable.");
      return response.json();
    })
    .catch(() => ({
      html_url: highlightedRepositoryUrl,
      name: "Highlighted work",
      description: "Explore this project on GitHub.",
    }));
};

if (
  repositoryContainer &&
  highlightedRepositories.some((repository) => repository.url)
) {
  Promise.all(highlightedRepositories.map(loadRepository))
    .then((repositories) => {
      repositoryContainer.replaceChildren(
        ...repositories.map((repository, index) =>
          createCard(repository, highlightedRepositories[index]),
        ),
      );
    })
    .catch(() => {
      repositoryContainer.innerHTML =
        '<p class="empty-state">GitHub repositories could not be loaded.</p>';
    });
}
