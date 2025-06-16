let playerPtr = Number(sessionStorage.getItem('playerPtr')) || null;

document.addEventListener("DOMContentLoaded", () => {
  let section = document.querySelector("section");

  let textNode = section.firstChild;
  let number = textNode.textContent.match(/\d+/)[0];

  let header = createHeader() ;

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

  removeEmptyParagraphs();
  checkForMealChoice();
  printPictures();
});


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


function moveFooter(section) {
  let footer = document.createElement("footer") ;
  footer.classList.add("footer");

  let footElements = section.querySelectorAll('[id*="-foot"]') ;

  footElements.forEach(el => {
    let parentDiv = el.closest('div') ;
    if (parentDiv) {
      footer.appendChild(parentDiv) ;
    }
  }) ;

  return footer ;
}

function removeEmptyParagraphs() {
  document.querySelectorAll('p').forEach(p => {
    if (!p.textContent.trim()) {
      p.remove();
    }
  });
}

function printPictures()
{
	let baseURL = "https://www.projectaon.org/en/xhtml/lw/02fotw/" ;
	let illustrations = document.querySelectorAll("div.float, div.inline") ;

	illustrations.forEach(div => {
		let pictures = Array.from(div.getElementsByTagName("img")) ;
		let png = pictures.find(img => img.src.endsWith(".png")) ;

		// On vide la div pour ne garder que l'image
		div.innerHTML = "" ;
		if (png) {
		png.src = baseURL + png.getAttribute("src") ;
		div.appendChild(png) ;
		}
	}) ;
} 

// --------------------------------------------------------------

function checkForMealChoice()
{
    const paragraphs = document.querySelectorAll('p');
    let hasMealChoice = false;
    let mealParagraph = null;

    paragraphs.forEach(p => {
        const text = p.textContent.toLowerCase();
        if (text.includes('eat') && text.includes('meal') && text.includes('endurance')) {
            hasMealChoice = true;
            mealParagraph = p;
        }
    });

    if (hasMealChoice && mealParagraph) {
        const mealInterface = document.createElement('div');
        mealInterface.id = 'meal-interface';
        mealInterface.innerHTML = `
            <button id="eat-meal">Manger un repas</button>
            <button id="skip-meal">Ne pas manger</button>
            <p id="meal-message" style="color: red;"></p>
        `;

        const parent = mealParagraph.parentElement;

        let nextSibling = mealParagraph.nextElementSibling;
        while (nextSibling && !nextSibling.querySelector('a[href*="sect"]')) {
            nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling) {
            parent.insertBefore(mealInterface, nextSibling);
        } else {
            parent.appendChild(mealInterface);
        }

        const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
        narrativeLinks.forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        });

        document.getElementById('eat-meal').addEventListener('click', handleEatMeal);
        document.getElementById('skip-meal').addEventListener('click', handleSkipMeal);
    }

    return hasMealChoice;
}

let wasmReady = false;

Module.onRuntimeInitialized = () => {
    wasmReady = true;
};

function handleEatMeal() 
{
	if (!playerPtr) {
    	console.error("playerPtr non initialisé!");
    	return;
  	} 
    if (!wasmReady) {
        console.warn("WebAssembly pas encore prêt !");
        return;
    }
  
  	Module._eat(playerPtr, 1);
    enableNarrativeLinks();
}

function handleSkipMeal() 
{
	if (!playerPtr) {
    	console.error("playerPtr non initialisé!");
    	return;
  	}
    if (!wasmReady) {
        console.warn("WebAssembly pas encore prêt !");
        return;
    }
  
  	Module._eat(playerPtr, 0);
    enableNarrativeLinks();
}

function enableNarrativeLinks() 
{
    const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
    narrativeLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
    document.getElementById('meal-interface').remove();
}

// --------------------------------------------------------------