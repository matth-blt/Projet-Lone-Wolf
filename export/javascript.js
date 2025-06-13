document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section") ;
  const h1 = document.createElement("h1") ;

  h1.textContent = section.firstChild.textContent.trim();
  section.firstChild.remove() ;
  section.prepend(h1) ;
});