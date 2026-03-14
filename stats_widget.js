/**
 * Widget flottant pour afficher les stats du joueur
 * S'affiche sur toutes les pages de l'aventure
 */

// Crée le bouton flottant et la fenêtre de stats
function createStatsWidget() {
    // Ne pas afficher si pas de joueur sauvegardé
    const playerData = localStorage.getItem('player_autosave');
    if (!playerData) return;

    // Crée le bouton flottant
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'stats-toggle';
    floatingBtn.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" width="48" height="48"  fill="currentColor" viewBox="2 2 20 20" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path></svg>`;
    floatingBtn.title = 'Voir les stats';
    document.body.appendChild(floatingBtn);

    // Crée la fenêtre de stats (cachée par défaut)
    const statsPanel = document.createElement('div');
    statsPanel.id = 'stats-panel';
    statsPanel.innerHTML = `
        <div class="stats-header">
            <span>Player Stats</span>
        </div>
        <div class="stats-content"></div>
    `;
    document.body.appendChild(statsPanel);

    // Event listeners
    floatingBtn.addEventListener('click', () => {
        statsPanel.classList.toggle('visible');
        if (statsPanel.classList.contains('visible')) {
            updateStatsDisplay();
        }
    });

    document.getElementById('stats-close').addEventListener('click', () => {
        statsPanel.classList.remove('visible');
    });

    // Met à jour l'affichage des stats
    function updateStatsDisplay() {
        const data = localStorage.getItem('player_autosave');
        if (!data) return;

        try {
            const player = JSON.parse(data);
            const content = statsPanel.querySelector('.stats-content');

            // Liste des armes
            const weaponNames = ["Dagger", "Spear", "Mace", "Short Sword", "Warhammer",
                "Sword", "Axe", "Quarterstaff", "Broadsword", "Bow"];
            const weapons = player.weapons
                .map((has, i) => has ? weaponNames[i] : null)
                .filter(w => w)
                .join(', ') || 'None';

            // Liste des disciplines
            const disciplineNames = ["Camouflage", "Hunting", "Sixth Sense", "Tracking",
                "Weaponskill", "Healing", "Mindshield", "Mindblast",
                "Animal Kinship", "Mind Over Matter"];
            const disciplines = player.disciplines
                .map((has, i) => has ? disciplineNames[i] : null)
                .filter(d => d)
                .join(', ') || 'None';

            // Génère les badges pour armes
            const weaponBadges = player.weapons
                .map((has, i) => has ? `<span class="badge weapon">${weaponNames[i]}</span>` : null)
                .filter(w => w)
                .join('') || '<span class="badge empty">None</span>';

            // Génère les badges pour disciplines  
            const disciplineBadges = player.disciplines
                .map((has, i) => has ? `<span class="badge discipline">${disciplineNames[i]}</span>` : null)
                .filter(d => d)
                .join('') || '<span class="badge empty">None</span>';

            // Calcul des pourcentages pour les barres
            const endurancePercent = Math.round((player.endurance / player.enduranceMax) * 100);
            const goldPercent = Math.round((player.bag?.gold || 0) / 50 * 100);

            content.innerHTML = `
                <div class="stat-row name-row">
                    <span class="player-name">${player.name || 'Unknown'}</span>
                </div>

                <hr>

                <div class="stat-section">
                    <div class="stat-row">
                        <span class="stat-label">Endurance</span>
                        <span class="stat-value">${player.endurance} / ${player.enduranceMax}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill health" style="width: ${endurancePercent}%"></div>
                    </div>
                </div>

                <div class="stat-section">
                    <div class="stat-row">
                        <span class="stat-label">Combat Skill</span>
                        <span class="stat-value">${player.combatSkill}</span>
                    </div>
                </div>

                <hr>

                <span class="stat-label">Inventory</span>
                <div class="stat-row-inline">
                    <div class="mini-stat">
                        <span class="mini-icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M21.98 9.34C21.79 6.49 16.87 5 12 5S2.21 6.49 2.02 9.34c.19 1.95 4.23 4.06 9.98 4.06s9.8-2.11 9.98-4.06M13 19c1.39-.06 2.76-.24 4-.54v-3.59c-1.23.28-2.57.45-4 .51v3.63Zm-6-.54c1.24.3 2.61.48 4 .54v-3.63a22.3 22.3 0 0 1-4-.51v3.59Zm12-.64c1.8-.76 3-1.86 3-3.3v-1.79c-.8.62-1.82 1.16-3 1.58zm-17-3.3c0 1.44 1.2 2.55 3 3.3v-3.51c-1.18-.43-2.2-.96-3-1.58z"></path></svg>
                        </span>
                        <span class="mini-value">${player.bag?.gold || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M3.5 8c.35 0 .66-.12.92-.32l.64.96c-1.78.91-3.01 2.73-3.01 4.86 0 3 2.44 5.46 5.45 5.5h7.76c2.73 0 5.14-1.55 6.13-3.95.48-1.15.67-2.38.58-3.64-.27-3.71-3.24-6.86-6.92-7.34-2.59-.33-5.1.61-6.82 2.42C11.3 7.61 13.5 10.55 13.5 14h-2c0-2.71-1.81-4.98-4.28-5.72L6.23 6.8c.45-.26.76-.74.76-1.3 0-.83-.67-1.5-1.5-1.5-.69 0-1.27.47-1.44 1.11A1.498 1.498 0 0 0 1.99 6.5c0 .83.67 1.5 1.5 1.5Z"></path></svg>
                        </span>
                        <span class="mini-value">${player.bag?.meals || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="currentColor" viewBox="0 0 24 24" ><!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--><path d="M15 7.66V4h1V2H8v2h1v3.66l-5.4 6.95a4.58 4.58 0 0 0-.48 4.86A4.56 4.56 0 0 0 7.22 22h9.57c1.75 0 3.32-.97 4.1-2.53.78-1.57.6-3.48-.48-4.86l-5.4-6.95Zm-4 .69V4.01h2v4.34l5.2 6.68c-1.79-.3-2.9-1.03-4.14-1.86-1.31-.87-2.77-1.83-5.11-2.18z"></path></svg>
                        </span>
                        <span class="mini-value">${player.bag?.potionsHealing || 0}</span>
                    </div>
                </div>

                <hr>

                <div class="badges-section">
                    <span class="stat-label">Weapons</span>
                    <div class="badges-container">${weaponBadges}</div>
                </div>

                <div class="badges-section">
                    <span class="stat-label">Disciplines</span>
                    <div class="badges-container">${disciplineBadges}</div>
                </div>
            `;
        } catch (e) {
            console.error('Error parsing player data:', e);
        }
    }
}

// Injecte les styles CSS
function injectStyles() {
    const scriptEl = document.querySelector('script[src$="stats_widget.js"]');
    const cssHref = scriptEl
        ? new URL('stats_widget.css', scriptEl.src).href
        : 'stats_widget.css';

    if (document.querySelector(`link[href="${cssHref}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createStatsWidget();
});
