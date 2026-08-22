// Add as many projects as needed. visibleTitle is optional.
const projects = [
  {
    url: "https://github.com/xVlkan7/drone-proj",
    visibleTitle: "Drone Project",
  },
];

const projectContainer = document.querySelector("[data-projects]");

const createProjectCard = (repository, project) => {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = repository.html_url || project.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const title = document.createElement("h2");
  title.textContent =
    project.visibleTitle || repository.name || "Project on GitHub";
  const description = document.createElement("p");
  description.textContent =
    repository.description || "Explore this project on GitHub.";
  const link = document.createElement("span");
  link.className = "card-link";
  link.textContent = "View on GitHub ";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.append(arrow);

  card.append(title, description, link);
  return card;
};

const loadProject = ({ url: repositoryUrl }) => {
  let repositoryApiUrl;
  try {
    const url = new URL(repositoryUrl);
    const path = url.pathname.split("/").filter(Boolean);
    if (
      !/^www\.github\.com$|^github\.com$/i.test(url.hostname) ||
      path.length < 2
    ) {
      throw new Error("Invalid GitHub repository URL.");
    }
    repositoryApiUrl = `https://api.github.com/repos/${path[0]}/${path[1]}`;
  } catch {
    return Promise.resolve({
      name: "Project on GitHub",
      description: "Explore this project on GitHub.",
      html_url: repositoryUrl,
    });
  }

  return fetch(repositoryApiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("GitHub repository is unavailable.");
      return response.json();
    })
    .catch(() => ({
      name: "Project on GitHub",
      description: "Explore this project on GitHub.",
      html_url: repositoryUrl,
    }));
};

if (projectContainer) {
  if (!projects.length) {
    projectContainer.innerHTML =
      '<p class="loading-message">Add GitHub repository links in <code>assets/js/projects.js</code> to show them here.</p>';
  } else {
    Promise.all(projects.map(loadProject))
      .then((repositories) => {
        projectContainer.replaceChildren(
          ...repositories.map((repository, index) =>
            createProjectCard(repository, projects[index]),
          ),
        );
      })
      .catch(() => {
        projectContainer.innerHTML =
          '<p class="empty-state">Projects could not be loaded.</p>';
      });
  }
}
