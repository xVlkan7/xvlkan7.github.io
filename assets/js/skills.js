const skills = [
  { name: "Python", icon: "_" },
  { name: "JavaScript", icon: "_" },
  { name: "Backend systems", icon: "_" },
  { name: "REST APIs", icon: "_" },
  { name: "SQL & data", icon: "_" },
  { name: "Web development", icon: "_" },
  { name: "HTML & CSS", icon: "_" },
  { name: "Problem solving", icon: "_" },
];

document.querySelectorAll("[data-skills]").forEach((list) => {
  skills.forEach(({ name, icon }) => {
    const item = document.createElement("li");
    const iconSlot = document.createElement("span");
    const label = document.createElement("span");

    iconSlot.className = "tag-icon";
    iconSlot.setAttribute("aria-hidden", "true");
    iconSlot.textContent = icon;
    label.textContent = name;
    item.append(iconSlot, label);
    list.append(item);
  });
});
