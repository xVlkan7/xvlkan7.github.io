const skills = [
  { name: "Problem solving", icon: "problem-solving.svg" },
  { name: "Web Development", icon: "computer.svg" },
  { name: "TypeScript", icon: "typescript.svg" },
  { name: "HTML & CSS", icon: "html-css.svg" },
  { name: "Angular", icon: "angular.svg" },
  { name: "React", icon: "react.svg" },
  { name: "Python", icon: "python.svg" },
  { name: "SQL + Data", icon: "sql.svg" },
  { name: "z/OS Mainframes", icon: "ibm-z.svg" },
  { name: "Excel", icon: "excel.svg" },
  { name: "Financial Analysis", icon: "money.svg" },
  { name: "Quantitative Finance", icon: "graph.svg" },
];

document.querySelectorAll("[data-skills]").forEach((list) => {
  skills.forEach(({ name, icon }) => {
    const item = document.createElement("li");
    const iconSlot = document.createElement("span");
    const label = document.createElement("span");

    iconSlot.className = "tag-icon";
    iconSlot.setAttribute("aria-hidden", "true");
    if (icon.endsWith(".svg")) {
      const image = document.createElement("img");
      image.src = new URL(`../icons/${icon}`, document.currentScript.src);
      image.alt = "";
      iconSlot.append(image);
    } else {
      iconSlot.textContent = icon;
    }
    label.textContent = name;
    item.append(iconSlot, label);
    list.append(item);
  });
});
