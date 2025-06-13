document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section");
  section.innerHTML = `<h1>${section.textContent.trim()}</h1>` + section.innerHTML.slice(section.textContent.trim().length);
});