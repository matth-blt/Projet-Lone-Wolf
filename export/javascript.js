let playerPtr = Number(sessionStorage.getItem('playerPtr')) || null;

document.addEventListener("DOMContentLoaded", () => {
	let section = document.querySelector("section");

	//On récupère le numéro de la section
	let textNode = section.firstChild;
	let number = textNode.textContent.match(/\d+/)[0];

	let h1 = document.createElement("h1");
	h1.textContent = number;
	section.removeChild(textNode);
	
	let div = document.createElement("div");
	div.className = "content";
	div.appendChild(h1);

	// On met tous les enfants dans la div
	while (section.firstChild) {
		div.appendChild(section.firstChild);
	}

	section.appendChild(div);

	printPictures();
	checkForMealChoice();
});

// Fonction qui affiche les images dans le format png uniquement
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

    // 1. Trouver le paragraphe contenant les mots-clés
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

        // 2. Insertion universelle
        const parent = mealParagraph.parentElement;
        
        // Trouver le prochain élément contenant un lien narratif
        let nextSibling = mealParagraph.nextElementSibling;
        while (nextSibling && !nextSibling.querySelector('a[href*="sect"]')) {
            nextSibling = nextSibling.nextElementSibling;
        }

        // Insérer avant le premier lien narratif trouvé
        if (nextSibling) {
            parent.insertBefore(mealInterface, nextSibling);
        } 
        // Sinon insérer après le paragraphe détecté
        else {
            parent.appendChild(mealInterface);
        }

        // 3. Désactiver tous les liens narratifs
        const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
        narrativeLinks.forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        });

        // 4. Gestion des événements
        document.getElementById('eat-meal').addEventListener('click', handleEatMeal);
        document.getElementById('skip-meal').addEventListener('click', handleSkipMeal);
    }

    return hasMealChoice;
}

function handleEatMeal() 
{
	if (!playerPtr) {
    	console.error("playerPtr non initialisé!");
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