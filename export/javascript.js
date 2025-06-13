document.addEventListener("DOMContentLoaded", () => {
  let section = document.querySelector("section");
  let div = document.createElement("div");
  div.className = "content";

  let textNode = section.firstChild;
  let number = textNode.textContent.match(/\d+/)[0]; // Pour récupérer le numéro de section

  let h1 = document.createElement("h1");
  h1.textContent = number;
  section.removeChild(textNode);
  div.appendChild(h1);

  while (section.firstChild) {
    div.appendChild(section.firstChild);
  }

  section.appendChild(div);

  printPictures();
});

// Fonction qui affiche les images dans le format png
function printPictures() {
  let baseURL = "https://www.projectaon.org/en/xhtml/lw/02fotw/" ;
  let illustrations = document.querySelectorAll("div.float, div.inline") ;

  illustrations.forEach(div => {
    let pictures = Array.from(div.getElementsByTagName("img")) ;
    let png = pictures.find(img => img.src.endsWith(".png")) ;

    div.innerHTML = "" ;
    if (png) {
      png.src = baseURL + png.getAttribute("src") ;
      div.appendChild(png) ;
    }
  }) ;
} 
