// ==== FONCTIONS D'INTERFACE UTILISATEUR ====
let player = null;
let disciplinesChosen = 0;
const MAX_DISCIPLINES = 6;

// -------------------------------------------------------------------

// ==== FONCTIONS UTILES ====

export function updateDisplay(message) {
    const output = document.getElementById("game-output");
    output.innerText += message + "\n";
    output.scrollTop = output.scrollHeight;
}

function showStep(stepId) {
    ["step-name", "step-weapon", "step-disciplines"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = (id === stepId) ? "block" : "none";
        }
    });
}

function showSectionLoaded() {
    ["step-name", "step-weapon", "step-disciplines", "next-step"].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = "none";
    });
    
    const gameContent = document.getElementById("game-content");
    if(gameContent) gameContent.style.display = "block";
}

// -------------------------------------------------------------------

// ==== INITIALISATION ====
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("create-player-btn").addEventListener("click", createPlayer);
//     showStep("step-name");
//     document.getElementById("next-step").addEventListener("click", nextStep);
// });
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("step-name")) {
        const createBtn = document.getElementById("create-player-btn");
        if (createBtn) createBtn.addEventListener("click", createPlayer);
        
        const nextBtn = document.getElementById("next-step");
        if (nextBtn) nextBtn.addEventListener("click", nextStep);
        
        showStep("step-name");
    }
});

// -------------------------------------------------------------------

// ==== CLASSE GAME ====
class Game {
    static WEAPON_MAX = 2;

    static Disciplines = {
        CAMOUFLAGE: 0,
        HUNTING: 1,
        SIXTH_SENSE: 2,
        TRACKING: 3,
        WEAPONSKILL: 4,
        HEALING: 5,
        MINDSHIELD: 6,
        MINDBLAST: 7,
        ANIMAL_KINSHIP: 8,
        MIND_OVER_MATTER: 9
    };

    static Weapons = {
        DAGGER: 0,
        SPEAR: 1,
        MACE: 2,
        SHORT_SWORD: 3,
        WARHAMMER: 4,
        SWORD: 5,
        AXE: 6,
        QUARTERSTAFF: 7,
        BROADSWORD: 8,
        BOW: 9
    };

    static SpecialItems = {
        TICKET: 0,
        SEAL_OF_HAMMERDAL: 1,
        MAGIC_SPEAR: 2,
        CRYSTAL_STAR_PENDANT: 3,
        RED_PASS: 4,
        WHITE_PASS: 5,
        DOCUMENTS: 6
    };

    static generateRnt() { return Math.floor(Math.random() * 10); }

    static playerGenerator(name) {
        const player = {
            name: name,
            endurance: Game.generateRnt() + 20,
            enduranceMax: 0,
            combatSkill: Game.generateRnt() + 10,
            disciplines: new Array(10).fill(false),
            nbrDiscipline: 0,
            weapons: new Array(10).fill(false),
            nbrWeapon: 0,
            weaponskillWeapon: -1,
            bag: {
                gold: Game.generateRnt() + 10,
                meals: 0,
                potionsHealing: 0,
                arrows: 0,
                specialItems: new Array(7).fill(false)
            },
            combat: false
        };
        player.enduranceMax = player.endurance;
        return player;
    }

    static chooseWeapon(player, weaponIndex) {
        if (player.nbrWeapon >= Game.WEAPON_MAX) return false;
        
        if (weaponIndex >= 0 && weaponIndex < 10 && !player.weapons[weaponIndex]) {
            player.weapons[weaponIndex] = true;
            player.nbrWeapon++;
            return true;
        }
        return false;
    }

    static chooseDiscipline(player, disciplineIndex) {
        if (player.nbrDiscipline >= 6) return false;
        
        if (disciplineIndex >= 0 && disciplineIndex < 10 && !player.disciplines[disciplineIndex]) {
            player.disciplines[disciplineIndex] = true;
            player.nbrDiscipline++;
            
            if (disciplineIndex === Game.Disciplines.WEAPONSKILL) {
                player.weaponskillWeapon = Game.generateRnt();
                const weaponNames = [
                    "Dagger", "Spear", "Mace", "Short Sword", 
                    "Warhammer", "Sword", "Axe", "Quarterstaff",
                    "Broadsword", "Bow"
                ];
                updateDisplay(`[The bonus will apply to the weapon : ${weaponNames[player.weaponskillWeapon]}]`);
                if (player.weapons[player.weaponskillWeapon]) {
                    updateDisplay("[Owned Weapon, +2 Combat Skill if equipped]");
                }
            }
            return true;
        }
        return false;
    }

    static savePlayer(player, saveName = "autosave") {
        const saveData = {
            name: player.name,
            endurance: player.endurance,
            enduranceMax: player.enduranceMax,
            combatSkill: player.combatSkill,
            disciplines: player.disciplines,
            weapons: player.weapons,
            weaponskillWeapon: player.weaponskillWeapon,
            bag: player.bag
        };

        // Sauvegarde dans localStorage
        localStorage.setItem(`player_${saveName}`, JSON.stringify(saveData));
        
        // Sauvegarde dans un fichier (pour démonstration)
        this.saveToFile(saveData, "player_autosave.json");
        
        return saveData;
    }

    static saveToFile(data, filename) {
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

    static async loadPlayer(saveName = "autosave") {
        const saveData = localStorage.getItem(`playerSave_${saveName}`);
        if (saveData) return JSON.parse(saveData);

        try {
            const response = await fetch("ressources/player.json");
            return response.ok ? await response.json() : null;
        } catch (e) {
            return null;
        }
    }
}

export default Game;

// -------------------------------------------------------------------

// ==== FONCTIONS DE CREATION DE PERSONNAGE ====
function createPlayer() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();

    if (!name) {
        updateDisplay("Enter a valid player name");
        return;
    }

    player = Game.playerGenerator(name);
    updateDisplay(`Player : ${name}`);
    updateDisplay(`Endurance/Endurance Max : ${player.endurance} | Combat Skill : ${player.combatSkill}`);
    updateDisplay("Choose your weapon below.");
    showStep("step-weapon");
    renderWeaponChoices();
}

function renderWeaponChoices() {
    const weapons = [
        "Dagger", "Spear", "Mace", "Short Sword", "Warhammer",
        "Sword", "Axe", "Quarterstaff", "Broadsword", "Bow"
    ];
    const container = document.getElementById("weapon-choices");
    container.innerHTML = "";

    weapons.forEach((weapon, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${weapon}`;
        link.onclick = () => {
            if (Game.chooseWeapon(player, i)) {
                updateDisplay(`Weapon chosen : ${weapon}`);
                
                // Passer aux disciplines après avoir choisi 2 armes
                if (player.nbrWeapon == 1) {
                    showStep("step-disciplines");
                    renderDisciplineChoices();
                }
            } else {
                updateDisplay("Invalid choice or already owned !");
            }
        };
        container.appendChild(link);
    });
}

function renderDisciplineChoices() {
    const disciplines = [
        "Camouflage", "Hunting", "Sixth Sense", "Tracking", "Weaponskill",
        "Healing", "Mindshield", "Mindblast", "Animal Kinship", "Mind Over Matter"
    ];
    const container = document.getElementById("discipline-choices");
    container.innerHTML = "";

    disciplines.forEach((discipline, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${discipline}`;
        
        // Désactiver visuellement les disciplines déjà choisies
        if (player.disciplines[i]) {
            link.classList.add("disabled");
        }

        link.onclick = () => {
            // Vérifier si on peut encore choisir des disciplines
            if (disciplinesChosen >= MAX_DISCIPLINES) {
                updateDisplay("You have already chosen 6 disciplines !");
                return;
            }
            
            if (Game.chooseDiscipline(player, i)) {
                updateDisplay(`Discipline chosen : ${discipline}`);
                link.classList.add("disabled");
                link.onclick = null;
                disciplinesChosen++;

                // Activer le bouton suivant après 6 disciplines
                if (disciplinesChosen >= MAX_DISCIPLINES) {
                    document.getElementById("next-step").style.display = "inline-block";
                    updateDisplay("Selection complete. Ready to start the adventure !");
                }
            } else {
                updateDisplay("Invalid choice or already owned !");
            }
        };
        container.appendChild(link);
    });
}

function nextStep() {
    if (player) {
        // Sauvegarder le joueur avant de continuer
        Game.savePlayer(player, "current");
        updateDisplay("The adventure begins ! Redirecting...");
        
        // Redirection vers la page de l'aventure
        setTimeout(() => {
            window.location.href = "./export/sect1.html";
        }, 1500);
    } else {
        updateDisplay("Please create your character first");
    }
}

// -------------------------------------------------------------------
