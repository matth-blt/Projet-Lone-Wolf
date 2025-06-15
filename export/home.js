let playerPtr = null;
let disciplinesChosen = 0;
const MAX_DISCIPLINES = 6;

// ------------------------------------------------------------------

function updateDisplay(message)
{
    const output = document.getElementById("game-output");
    output.innerText += message + "\n";
    output.scrollTop = output.scrollHeight;
}

// ------------------------------------------------------------------

function showStep(stepId)
{
    ["step-name", "step-weapon", "step-disciplines"].forEach(id => {
        document.getElementById(id).style.display = (id === stepId) ? "block" : "none";
    });
}

// ------------------------------------------------------------------

// function saveAllHTMLFiles() {
//     const files = FS.readdir('/export');

//     for (const name of files) {
//         if (name.endsWith('.html')) {
//             try {
//                 const content = FS.readFile(`/export/${name}`, { encoding: 'utf8' });
//                 const blob = new Blob([content], { type: 'text/html' });
//                 const link = document.createElement('a');
//                 link.href = URL.createObjectURL(blob);
//                 link.download = name;
//                 document.body.appendChild(link); // Nécessaire sur Firefox
//                 link.click();
//                 document.body.removeChild(link);
//             } catch (e) {
//                 console.error("Erreur lors de la lecture de", name, e);
//             }
//         }
//     }
// }

// ------------------------------------------------------------------

function createPlayer()
{
    const input = document.getElementById("playerName");
    const name = input.value.trim();

    if (!name) {
        updateDisplay("Entrez un nom de joueur valide");
        return;
    }

    const namePtr = Module._malloc(256);
    Module.stringToUTF8(name, namePtr, 256);

    playerPtr = Module._player_generator(namePtr);
    Module._free(namePtr);

    updateDisplay(`Joueur créé : ${name}`);
    updateDisplay("Choisissez votre arme ci-dessous.");
    showStep("step-weapon");

    renderWeaponChoices();
}

// ------------------------------------------------------------------

function renderWeaponChoices()
{
    const weapons = [
        "Dagger", "Spear", "Mace", "Short Sword", "Warhammer",
        "Sword", "Axe", "Quarterstaff", "Broadsword", "Bow"
    ];
    const container = document.getElementById("weapon-choices");
    container.innerHTML = "";

    weapons.forEach((weapon, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${i + 1} - ${weapon}`;
        link.onclick = () => {
        Module._weapon_choice(playerPtr, i);
        // updateDisplay(`Arme choisie : ${weapon}`);
        showStep("step-disciplines");
        renderDisciplineChoices();
        };
        container.appendChild(link);
    });
}

// ------------------------------------------------------------------

function renderDisciplineChoices()
{
    const disciplines = [
        "Camouflage", "Hunting", "Sixth Sense", "Tracking", "Weaponskill",
        "Healing", "Mindshield", "Mindblast", "Animal Kinship", "Mind Over Matter"
    ];
    const container = document.getElementById("discipline-choices");
    container.innerHTML = "";

    disciplines.forEach((discipline, i) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = `${i + 1} - ${discipline}`;
        link.onclick = () => {
        if (disciplinesChosen >= MAX_DISCIPLINES) return;

        Module._discipline_choice(playerPtr, i);
        updateDisplay(`Discipline choisie : ${discipline}`);
        link.classList.add("disabled");
        link.onclick = null;

        disciplinesChosen++;
        if (disciplinesChosen === MAX_DISCIPLINES) {
            updateDisplay("Choix terminé. Prêt à débuter l’aventure !");
            document.getElementById("next-step").style.display = "inline-block";
        }
        };
        container.appendChild(link);
    });
}

// ------------------------------------------------------------------

function nextStep()
{
    updateDisplay("L'aventure commence !");
    // Rediriger vers la 1ère section, ou autre action
    // window.location.href = "sect1.html"; // Ex. si généré
    window.location.href = "export/sect1.html";
}

// ------------------------------------------------------------------
