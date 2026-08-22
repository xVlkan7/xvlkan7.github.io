const storageKey = "theme";
const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const savedTheme = localStorage.getItem(storageKey);

if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}

const updateToggle = () => {
  if (!toggle) return;

  const isDark = root.dataset.theme !== "light";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);
  toggle.innerHTML = isDark
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 15.79A9 9 0 0 1 8.21 3.4 9 9 0 1 0 20.6 15.79Z"></path></svg>';
};

updateToggle();

toggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem(storageKey, root.dataset.theme);
  updateToggle();
});

const footerIcons = {
  Email:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 7l9 6 9-6"></path></svg>',
  GitHub:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.17-1.11-1.48-1.11-1.48-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.47A10 10 0 0 0 12 2Z"></path></svg>',
  LinkedIn:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3.5ZM5.25 10h2.5v8.5h-2.5zM10 10h2.4v1.16h.03c.33-.63 1.14-1.3 2.35-1.3 2.52 0 2.97 1.66 2.97 3.82v4.82h-2.5v-4.27c0-1.02-.02-2.34-1.43-2.34s-1.65 1.11-1.65 2.27v4.34H10z"></path></svg>',
  "X / Twitter":
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h3.9l4.23 5.66L17 4h3l-6.48 7.3L20 20h-3.9l-4.67-6.25L5.5 20h-3l6.93-7.8L4 4Zm3.18 1.7H6.1l9.96 12.6h1.08L7.18 5.7Z"></path></svg>',
};

document.querySelectorAll(".site-footer a").forEach((link) => {
  const label = link.textContent.trim();
  if (!footerIcons[label] || link.querySelector("svg")) return;
  link.classList.add("footer-logo-link");
  link.insertAdjacentHTML("afterbegin", footerIcons[label]);
});
