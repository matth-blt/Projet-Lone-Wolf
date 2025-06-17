import Game from './player_creation.js';

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

function saveToFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function saveJSON(namefile, player) {
    localStorage.setItem(namefile, JSON.stringify(player));
    console.log("Sauvegarde localStorage :", localStorage.getItem(namefile));
    // Game.saveToFile(player, "player_autosave.json");
    // const data = JSON.stringify(player);
    // localStorage.setItem(namefile, data);
}

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

        // localStorage.setItem("player_autosave", JSON.stringify(player));
        // console.log("Sauvegarde localStorage :", localStorage.getItem("player_autosave"));
        return message;
        
        // if (player?.disciplines?.[Game.Disciplines.HUNTING]) {
        // return "[No need to eat, you have the Hunter discipline !]";
        // }

        // // let message = null;
        // if (choice === true) {
        //     if (player.bag.meals > 0) {
        //         player.bag.meals--;
        //         // message = "[-1 Food]";
        //         console.log("[-1 Food]");
        //     } else {
        //         player.endurance -= 3;
        //         // message = "[-3 Endurance]";
        //         console.log("[-3 Endurance]");
        //     }
        // } else {
        //     player.endurance -= 3;
        //     // message = "[-3 Endurance]";
        //     console.log("[-3 Endurance]");
        // }
            
        

        // // localStorage.setItem("player_autosave", JSON.stringify(player));
        // saveJSON("player_autosave", player);
        // return message;
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

export function importPlayer() {
    
    const elements = document.querySelectorAll('section[id^="sect"]');
    const newinput = document.createElement('input');
    const newbutton = document.createElement('button');

    newinput.id = 'jsonFile';
    newinput.type = 'file';
    newinput.accept = '.json';
    
    newbutton.textContent='Load';

    elements[0].appendChild(newinput);
    elements[0].appendChild(newbutton);

    newinput.addEventListener('change', function(event) {
    const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                const jsonData = JSON.parse(content);
                localStorage.setItem("player_autosave", JSON.stringify(jsonData));
            } catch (error) {
                alert("Erreur lors de la lecture du fichier JSON : " + error.message);
            }
        };
        reader.readAsText(file);
    });

    newbutton.addEventListener('click', () => {
        loadFromStorage();
    });


}

function loadFromStorage() {
    const saved = localStorage.getItem("player_autosave");
    if (!saved) {
        alert("Aucune donnée trouvée dans localStorage.");
        return;
    };
    checkForMealChoice();
}

function checkForMealChoice() {
    
    // ✅ Ne rien faire si l'interface existe déjà
    if (document.getElementById('meal-interface')) {
        return false;
    }

    
    const paragraphs = document.querySelectorAll('p');
    let hasMealChoice = false;
    let mealParagraph = null;

    // Recherche du paragraphe contenant le choix de repas
    paragraphs.forEach(p => {
        const text = p.textContent.toLowerCase();
        if (text.includes('eat') && text.includes('meal') && text.includes('endurance')) {
            hasMealChoice = true;
            mealParagraph = p;
        }
    });

    if (hasMealChoice && mealParagraph) {
        // Création de l'interface de repas
        const mealInterface = document.createElement('div');
        mealInterface.id = 'meal-interface';
        mealInterface.innerHTML = `
            <button id="eat-meal">EAT</button>
            <button id="skip-meal">SKIP</button>
            <input type="file" id="player-import" accept=".json" style="display: none;">
        `;

        // Insertion de l'interface dans le DOM
        const parent = mealParagraph.parentElement;
        if (parent) {
            let nextSibling = mealParagraph.nextElementSibling;
            let inserted = false;
            
            // Recherche du prochain lien narratif pour positionnement
            while (nextSibling && !inserted) {
                if (nextSibling.querySelector('a[href*="sect"]')) {
                    parent.insertBefore(mealInterface, nextSibling);
                    inserted = true;
                }
                nextSibling = nextSibling.nextElementSibling;
            }
            
            // Insertion à la fin si aucun lien trouvé
            if (!inserted) {
                parent.appendChild(mealInterface);
            }
        }

        // Désactivation des liens narratifs
        const narrativeLinks = document.querySelectorAll('a[href*="sect"]');
        narrativeLinks.forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        });

        // Ajout des écouteurs d'événements avec vérification
        setTimeout(() => {
            const eatBtn = document.getElementById('eat-meal');
            const skipBtn = document.getElementById('skip-meal');
            
            if (eatBtn) eatBtn.addEventListener('click', handleEatMeal);
            if (skipBtn) skipBtn.addEventListener('click', handleSkipMeal);
        }, 100);
    }

    return hasMealChoice;
}

async function handleEatMeal() {
     try {
        let player = readJSON("player_autosave");
        if (!player) {
            player = await importPlayer();
        }

        const result = Addons.eat(player, true);
        console.log(result);

        // Sauvegarde en mémoire
        localStorage.setItem("player_autosave", JSON.stringify(player));

        // Proposer téléchargement du fichier modifié
        saveToFile(player, "player_autosave_modified.json");

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

        // Sauvegarde directement après la modification
        localStorage.setItem("player_autosave", JSON.stringify(player));

        refreshPlayerData();
        enableNarrativeLinks();
    } catch (error) {
        console.error("Meal error:", error);
    }

}

function refreshPlayerData() {
    const player = readJSON("player_autosave");
    console.log("Joueur actuel :", player);
    // Mettez à jour l'affichage ici, si vous avez des champs visibles (points d'endurance, or, etc.)
}

async function updateServerWithPlayerData(player) {
  try {
    const response = await fetch('http://localhost:3000/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(player)
    });
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

document.addEventListener("DOMContentLoaded", () => {
    
    if (checkForMealChoice()) {
        importPlayer();
    }
});

// pour apres :
// let player = readJSON("player_autosave");
// // ... modifie player ...
// localStorage.setItem("player_autosave", JSON.stringify(player));
// updateServerWithPlayerData(player);
