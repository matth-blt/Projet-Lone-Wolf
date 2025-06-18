import Game from './player_creation.js';

// -------------------------------------------------------------------

export function enableNarrativeLinks() {
    const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
    narrativeLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
    document.getElementById('meal-interface').remove();
}

export function readJSON(namefile) {
    let player = null;
    let saveData = localStorage.getItem(namefile);
    if (saveData) {
        player = JSON.parse(saveData);    
    }
    return player;
}

// -------------------------------------------------------------------

// ==== CLASS ADDONS ====

class Addons {
    static GOLD_MAX = 50;
    static RESOURCE_MAX = 8;

    static gainGold(player, amount) {
        player.bag.gold += amount;
        if (player.bag.gold > Addons.GOLD_MAX) {
            player.bag.gold = Addons.GOLD_MAX;
            return "[Gold limit reached !]";
        }
        return null;
    }

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

// -------------------------------------------------------------------

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
            <div class="load">
                <p>Load your file (player stats) :</p>
                <label for="jsonFile" class="file-upload">Choose file</label>
                <input type="file" id="jsonFile" accept=".json" />
                <button id="loadBtn">Load</button>
            </div>

            <br>
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

        // chargement JSON 
        const jsonInput = mealInterface.querySelector('#jsonFile');
        const loadBtn = mealInterface.querySelector('#loadBtn');

        if (jsonInput && loadBtn) {
            // fichier sélectionné
            jsonInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const content = e.target.result;
                        const jsonData = JSON.parse(content);
                        // Sauvegarde dans localStorage
                        localStorage.setItem("player_autosave", JSON.stringify(jsonData));
                        refreshPlayerData();
                    } catch (error) {
                        alert("Erreur lors de la lecture du fichier JSON : " + error.message);
                    }
                };
                reader.readAsText(file);
            });

            // clique sur "Load"
            loadBtn.addEventListener('click', () => {
                // recharge les données depuis localStorage
                const saved = localStorage.getItem("player_autosave");
                if (!saved) {
                    alert("Aucune donnée trouvée dans localStorage.");
                    return;
                }
                refreshPlayerData();
            });
        }
    }

    // Renvoie true si un choix de repas a été détecté
    return hasMealChoice;
}

async function handleEatMeal() {
     try {
        // lit données player dans localStorage
        let player = readJSON("player_autosave");
        if (!player) {
            player = await importPlayer();
        }

        const result = Addons.eat(player, true);
        console.log(result);

        // Sauvegarde dans localStorage
        localStorage.setItem("player_autosave", JSON.stringify(player));

        updateServerWithPlayerData(player);

        refreshPlayerData();

        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }
}

async function handleSkipMeal() {
    try {
        let player = readJSON("player_autosave");
        if (!player) {
            player = await importPlayer();
        }
        
        Addons.eat(player, false);

        localStorage.setItem("player_autosave", JSON.stringify(player));

        updateServerWithPlayerData(player);

        refreshPlayerData();
        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }

}

// -------------------------------------------------------------------

function refreshPlayerData() {
    const player = readJSON("player_autosave");
    console.log("Joueur actuel :", player);
}

// -------------------------------------------------------------------

async function updateServerWithPlayerData(player) {
  try {
    // Envoie une requête POST
    const response = await fetch('http://localhost:3000/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...player,
        filename: "C:\\Users\\matth\\Downloads\\player_autosave.json"
      })
    });
    // Attend la réponse du serveur
    const result = await response.json();
    if (response.ok) {
      console.log("Données mises à jour sur le serveur :", result);
    } else {
      console.error("Erreur serveur :", result.error);
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}

// -------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    checkForMealChoice();
});
