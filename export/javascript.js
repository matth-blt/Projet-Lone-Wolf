document.addEventListener("DOMContentLoaded", () => {
    let section = document.querySelector("section");

    let textNode = section.firstChild;
    let number = textNode.textContent.match(/\d+/)[0];

    let header = createHeader();

    let content = document.createElement("div");
    content.className = "content";

    let h1 = document.createElement("h1");
    h1.textContent = number;

    section.removeChild(textNode);

    let footer = moveFooter(section);

    let otherChildren = Array.from(section.childNodes);
    otherChildren.forEach(node => {
        content.appendChild(node);
    });

    section.innerHTML = "";

    let container = document.createElement("div");
    container.className = "container";

    container.appendChild(header);
    content.insertBefore(h1, content.firstChild);
    container.appendChild(content);
    container.appendChild(footer);

    section.appendChild(container);

    document.querySelectorAll("p.combat").forEach(p => {
        let cs = p.querySelector(".combatskill");
        let endu = p.querySelector(".endurance");

        if (cs) cs.textContent = "Combat Skill : " + cs.textContent;
        if (endu) endu.textContent = "Endurance : " + endu.textContent;
    });

    removeEmptyParagraphs();
    printPictures();

    let signpost = document.querySelector("span.signpost");
    if (signpost) {
        let div = document.createElement("div");
        div.className = "signpost-box";

        signpost.parentNode.insertBefore(div, signpost);
        div.appendChild(signpost);
    }

    let random = document.getElementById("random");
    if (random) {
        random.style.cursor = "pointer";
        random.addEventListener("click", (e) => {
            e.preventDefault();
            randomNumberTable();
        });
    }
});


//Fonction qui permet de créer un header
function createHeader() {
    let header = document.createElement("header");

    let headerDiv = document.createElement("div");

    let title = document.createElement("p");
    title.textContent = "Fire on the Water";

    let authors = document.createElement("p");
    authors.textContent = "Joe Dever and Gary Chalk";

    headerDiv.appendChild(title);
    headerDiv.appendChild(authors);

    header.appendChild(headerDiv);

    return header;
}

//Fonction qui permet de déplacer les notes de bas de page dans le footer
function moveFooter(section) {
    let footer = document.createElement("footer");
    footer.classList.add("footer");

    let footElements = section.querySelectorAll('[id*="-foot"]');

    footElements.forEach(el => {
        let parentDiv = el.closest('div');
        if (parentDiv) {
            footer.appendChild(parentDiv);
        }
    });

    let divFooter = footer.querySelector("div");
    if (divFooter) {
        let newParagraph = document.createElement("p");
        newParagraph.textContent = "NOTA BENE :";
        divFooter.prepend(newParagraph);
    }
    return footer;
}

//Fonction qui permet de supprimer les paragraphes vides
function removeEmptyParagraphs() {
    document.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim()) {
            p.remove();
        }
    });
}

//Fonction qui permet de récupérer les images et d'afficher uniquement celle en format png
function printPictures() {
    // Images locales (téléchargées via download_images.py)
    let baseURL = "../ressources/images/";
    let illustrations = document.querySelectorAll("div.float, div.inline");

    illustrations.forEach(div => {
        let pictures = Array.from(div.getElementsByTagName("img"));
        let png = pictures.find(img => img.src.endsWith(".png"));

        div.innerHTML = "";
        if (png) {
            png.src = baseURL + png.getAttribute("src");
            png.loading = "lazy";  // Lazy loading pour de meilleures perfs
            div.appendChild(png);
        }
    });
}

//Fonction qui permet de créer une random table number 
function randomNumberTable() {
    let bubble = document.createElement("div");
    bubble.id = "random-bubble";

    let button = document.createElement("button");
    button.textContent = "Generate a number";

    let result = document.createElement("div");
    result.id = "random-result";

    let close = document.createElement("span");
    close.textContent = "✖";
    close.addEventListener("click", () => bubble.remove());

    button.addEventListener("click", () => {
        let number = Math.floor(Math.random() * 10);
        result.textContent = "Number : " + number;
    });

    bubble.appendChild(close);
    bubble.appendChild(button);
    bubble.appendChild(result);

    document.body.appendChild(bubble);
}