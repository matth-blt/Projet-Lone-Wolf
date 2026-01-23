import Game from './player_creation.js';

/**
 * Active tous les liens narratifs (liens vers des sections) et supprime l'interface de choix de repas
 *
 * Parcourt tous les <a> avec href contenant "sect", réactive leur clic
 * et les reaffiche. Supprime ensuite l'élément "meal-interface"
 */
export function enableNarrativeLinks() {
    const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
    narrativeLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
    document.getElementById('meal-interface').remove();
}

/**
 * Lit et retourne un objet JSON (player) stocké dans le localStorage
 *
 * @param {string} namefile - Nom de la clé dans le localStorage (player_autosave)
 * @returns {Object|null} - L'objet JSON parsé si trouvé, sinon null
 */
export function readJSON(namefile) {
    let player = null;
    let saveData = localStorage.getItem(namefile);
    if (saveData) {
        try {
            player = JSON.parse(saveData);
        } catch (e) {
            console.error("Erreur parsing JSON:", e);
            return null;
        }
    }
    return player;
}

// ==== CLASS ADDONS ====

class Addons {
    static GOLD_MAX = 50;
    static RESOURCE_MAX = 8;

    /**
     * Ajoute de l'or au joueur, sans dépasser la limite maximale
     * @param {Object} player
     * @param {number} amount - Or à ajouter
     * @returns {string|null} - Message si la limite est atteinte, sinon null
     */
    static gainGold(player, amount) {
        player.bag.gold += amount;
        if (player.bag.gold > Addons.GOLD_MAX) {
            player.bag.gold = Addons.GOLD_MAX;
            return "[Gold limit reached !]";
        }
        return null;
    }

    /**
     * Gère le choix de repas du joueur (manger ou perdre de l'endurance)
     * @param {Object} player
     * @param {boolean} choice - true si player eat, false si skip
     * @returns {string} - Message du choix 
     */
    static eat(player, choice) {

        if (player?.disciplines?.[Game.Disciplines.HUNTING]) {
            return "[No need to eat, you have the Hunter discipline !]";
        }

        let message = "";

        if (choice === true) {
            if (player.bag.meals > 0) {
                player.bag.meals--;
                message = "[-1 Food]";
            } else {
                player.endurance -= 3;
                message = "[-3 Endurance]";
            }
        } else {
            player.endurance -= 3;
            message = "[-3 Endurance]";
        }

        return message;
    }

    /**
     * Soigne le joueur s'il possède une potion de soin et n'est pas en combat
     * @param {Object} player
     * @returns {string|null} - Message d'erreur ou null
     */
    static heal(player) {
        if (player.combat) {
            return "You can't heal during a fight !";
        }

        if (player.endurance === player.enduranceMax) {
            return "Endurance is at maximum !";
        }

        if (player.bag.potionsHealing > 0) {
            player.bag.potionsHealing--;
            player.endurance = Math.min(player.endurance + 4, player.enduranceMax);

            if (player.endurance === player.enduranceMax) {
                return "Endurance is at maximum !";
            }
            return null;
        }
        return "Not enough Potions !";
    }
}
export default Addons;

/**
 * Vérifie si un choix de repas doit être proposé et affiche l'interface si besoin
 * Désactive les liens narratifs pendant le choix
 * @returns {boolean} - true si un choix de repas a été détecté, sinon false
 */
function checkForMealChoice() {
    if (document.getElementById('meal-interface')) {
        return false;
    }

    // Récupère les <p>
    const paragraphs = document.querySelectorAll('p');
    let hasMealChoice = false;
    let mealParagraph = null;

    // Recherche les <p> avec repas
    paragraphs.forEach(p => {
        const text = p.textContent.toLowerCase();
        if (text.includes('eat') && text.includes('meal') && text.includes('endurance')) {
            hasMealChoice = true;
            mealParagraph = p;
        }
    });

    // Si un paragraphe de repas
    if (hasMealChoice && mealParagraph) {
        const mealInterface = document.createElement('div');
        mealInterface.id = 'meal-interface';
        mealInterface.innerHTML = `
            <button id="eat-meal">EAT</button>
            <button id="skip-meal">SKIP</button>
        `;

        // interface avant le lien narratif
        const parent = mealParagraph.parentElement;
        if (parent) {
            let nextSibling = mealParagraph.nextElementSibling;
            let inserted = false;

            // Recherche le prochain élément avec un lien narratif pour insérer avant
            while (nextSibling && !inserted) {
                if (nextSibling.querySelector('a[href*="sect"]')) {
                    parent.insertBefore(mealInterface, nextSibling);
                    inserted = true;
                }
                nextSibling = nextSibling.nextElementSibling;
            }

            if (!inserted) {
                parent.appendChild(mealInterface);
            }
        }

        // Désactive les liens narratifs
        const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
        narrativeLinks.forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        });

        // écouteurs d'événements pour le boutons "EAT" et "SKIP"
        setTimeout(() => {
            const eatBtn = document.getElementById('eat-meal');
            const skipBtn = document.getElementById('skip-meal');

            if (eatBtn) eatBtn.addEventListener('click', handleEatMeal);
            if (skipBtn) skipBtn.addEventListener('click', handleSkipMeal);
        }, 100);
    }

    // Renvoie true si un choix de repas a été détecté
    return hasMealChoice;
}

/**
 * Gère le clic sur le bouton "EAT" : applique les effets, sauvegarde et réactive les liens
 */
async function handleEatMeal() {
    try {
        // lit données player dans localStorage
        let player = readJSON("player_autosave");
        if (!player) {
            alert("Aucun joueur trouvé. Créez un personnage d'abord.");
            return;
        }

        const result = Addons.eat(player, true);
        console.log(result);

        // Sauvegarde dans localStorage
        localStorage.setItem("player_autosave", JSON.stringify(player));

        refreshPlayerData();

        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }
}

/**
 * Gère le clic sur le bouton "SKIP" : applique les effets, sauvegarde et réactive les liens
 */
async function handleSkipMeal() {
    try {
        let player = readJSON("player_autosave");
        if (!player) {
            alert("Aucun joueur trouvé. Créez un personnage d'abord.");
            return;
        }

        Addons.eat(player, false);

        localStorage.setItem("player_autosave", JSON.stringify(player));

        refreshPlayerData();
        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }

}

/**
 * Affiche dans la console les données actuelles du joueur (pour debug)
 */
function refreshPlayerData() {
    const player = readJSON("player_autosave");
    console.log("Joueur actuel :", player);
}

document.addEventListener("DOMContentLoaded", () => {
    checkForMealChoice();
});
