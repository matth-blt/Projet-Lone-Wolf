import Fight from './fight.js';

let player = null;
let enemies = [];

/**
 * Exécute le combat en utilisant les données du joueur et des ennemis depuis le localStorage.
 * Affiche le journal du combat et gère la redirection vers la page suivante ou la fin de jeu.
 */
function executeCombat() {
    const saved = localStorage.getItem("player_autosave");
    const output = document.getElementById('game-output');

    if (!saved) {
        output.innerHTML = "Aucune donnée joueur trouvée!";
        return;
    }

    try {
        player = JSON.parse(saved);
    } catch (e) {
        output.innerHTML = "Erreur: données joueur corrompues!";
        return;
    }
    const enemiesJSON = localStorage.getItem('combatEnemies');
    const nextPage = localStorage.getItem('combatNextPage');

    if (!enemiesJSON) {
        output.innerHTML = "Aucun combat préparé!";
        return;
    }

    try {
        enemies = JSON.parse(enemiesJSON);
    } catch (e) {
        output.innerHTML = "Erreur: données ennemis corrompues!";
        return;
    }
    let combatLog = "<div class='terminal-line'>=== COMBAT START ===</div>";

    enemies.forEach(enemy => {
        combatLog += `<div class='terminal-line'>Enemy: ${enemy.name} | CS: ${enemy.combatSkill} | END: ${enemy.endurance}</div>`;

        const rc = Fight.calculeRc(player.combatSkill, enemy.combatSkill);
        let round = 1;
        let enemyEndurance = enemy.endurance;
        const MAX_ROUNDS = 100;

        while (player.endurance > 0 && enemyEndurance > 0 && round <= MAX_ROUNDS) {
            const nbr = Fight.generateRnt();
            const damages = Fight.calculePoint(rc, nbr);

            player.endurance = Math.max(0, player.endurance - damages.hero);
            enemyEndurance = Math.max(0, enemyEndurance - damages.enemi);

            combatLog += `<div class='terminal-line'>Round ${round}: RC=${rc}, RNT=${nbr}, You -${damages.hero} | ${enemy.name} -${damages.enemi}</div>`;
            round++;
        }

        if (round > MAX_ROUNDS) {
            combatLog += `<div class='terminal-line danger'>Combat interrompu (boucle infinie détectée) !</div>`;
        } else if (player.endurance <= 0) {
            combatLog += `<div class='terminal-line danger'>YOU ARE DEFEATED BY ${enemy.name}!</div>`;
        } else {
            combatLog += `<div class='terminal-line success'>${enemy.name} DEFEATED! Remaining END: ${player.endurance}</div>`;
        }
    });

    output.innerHTML = combatLog;
    localStorage.setItem("player_autosave", JSON.stringify(player));
    const redirectBtn = document.getElementById('redirectBtn');

    if (player.endurance <= 0) {
        redirectBtn.textContent = "Game Over - Restart";
        redirectBtn.onclick = () => window.location.href = './home.html';
    } else {
        const match = nextPage ? nextPage.match(/sect(\d+)/) : null;
        const number = match ? match[1] : "???";
        redirectBtn.textContent = `Continue to ${number}`;
        redirectBtn.onclick = () => window.location.href = nextPage;
    }

    redirectBtn.style.display = "block";
}

/**
 * Charge les données du joueur depuis le localStorage
 * et exécute automatiquement un combat.
 */
function loadFromStorage() {
    const saved = localStorage.getItem("player_autosave");
    if (!saved) {
        alert("Aucune donnée trouvée dans localStorage.");
        return;
    }
    player = JSON.parse(saved);
    updateDisplay("Joueur chargé depuis la mémoire : " + player.name);
    executeCombat();
}
document.getElementById('loadBtn').addEventListener('click', loadFromStorage);

/**
 * Affiche un message dans l'interface, simulant un terminal.
 * @param {string} message - Message à afficher.
 */
function updateDisplay(message) {
    const output = document.getElementById("game-output");
    output.innerHTML += `<div class="terminal-line">${message}</div>`;
    output.scrollTop = output.scrollHeight;
}

/**
 * Bouton de redirection visible après un combat.
 * Il est mis à jour dynamiquement selon la situation.
 */
document.getElementById('redirectBtn').addEventListener('click', function () {
    window.location.href = "page_suivante.html";
});