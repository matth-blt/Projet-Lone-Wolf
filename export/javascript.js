document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section");
  const h1 = document.createElement("h1");

  h1.textContent = section.firstChild.textContent.match(/\d+/)[0];

  section.firstChild.remove();
  section.prepend(h1);
});