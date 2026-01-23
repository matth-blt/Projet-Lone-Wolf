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
    floatingBtn.innerHTML = "<i class='bx bx-file'></i>";
    floatingBtn.title = 'Voir les stats';
    document.body.appendChild(floatingBtn);

    // Crée la fenêtre de stats (cachée par défaut)
    const statsPanel = document.createElement('div');
    statsPanel.id = 'stats-panel';
    statsPanel.innerHTML = `
        <div class="stats-header">
            <span>Player Stats</span>
            <button id="stats-close">✕</button>
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

                <div class="stat-section">
                    <div class="stat-row">
                        <span class="stat-label">❤️ Endurance</span>
                        <span class="stat-value">${player.endurance} / ${player.enduranceMax}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill health" style="width: ${endurancePercent}%"></div>
                    </div>
                </div>

                <div class="stat-section">
                    <div class="stat-row">
                        <span class="stat-label">⚔️ Combat Skill</span>
                        <span class="stat-value">${player.combatSkill}</span>
                    </div>
                </div>

                <hr>

                <div class="stat-row-inline">
                    <div class="mini-stat">
                        <span class="mini-icon">🪙</span>
                        <span class="mini-value">${player.bag?.gold || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">🍖</span>
                        <span class="mini-value">${player.bag?.meals || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">🧪</span>
                        <span class="mini-value">${player.bag?.potionsHealing || 0}</span>
                    </div>
                </div>

                <hr>

                <div class="badges-section">
                    <span class="stat-label">⚔️ Weapons</span>
                    <div class="badges-container">${weaponBadges}</div>
                </div>

                <div class="badges-section">
                    <span class="stat-label">✨ Disciplines</span>
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
    // Import Google Font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Import BoxIcons
    const boxIconsLink = document.createElement('link');
    boxIconsLink.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
    boxIconsLink.rel = 'stylesheet';
    document.head.appendChild(boxIconsLink);

    const style = document.createElement('style');
    style.textContent = `
        #stats-panel, #stats-panel * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #stats-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #282828 0%, #131313 100%);
            border: none;
            font-size: 24px;
            color: #e4a934;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #stats-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
        }

        #stats-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            background: linear-gradient(145deg, #282828 0%, #131313 100%);
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        }

        #stats-panel.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .stats-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-header span {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        #stats-close {
            background: none;
            border: none;
            color: #888;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }

        #stats-close:hover {
            color: #fff;
        }

        .stats-content {
            padding: 12px 16px;
        }

        .stats-content hr {
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin: 10px 0;
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
        }

        .name-row {
            justify-content: center;
            padding-bottom: 8px;
        }

        .player-name {
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
        }

        .stat-section {
            margin: 8px 0;
        }

        .stat-label {
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            color: #fff;
            font-size: 14px;
            font-weight: 600;
        }

        /* Progress Bar */
        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 6px;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .progress-fill.health {
            background: linear-gradient(90deg, #ef4444 0%, #22c55e 100%);
        }

        /* Mini Stats Row */
        .stat-row-inline {
            display: flex;
            justify-content: space-around;
            padding: 8px 0;
        }

        .mini-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }

        .mini-icon {
            font-size: 20px;
        }

        .mini-value {
            color: #fff;
            font-size: 14px;
            font-weight: 600;
        }

        /* Badges Section */
        .badges-section {
            margin: 10px 0;
        }

        .badges-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }

        .badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .badge.weapon {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #fff;
        }

        .badge.discipline {
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: #fff;
        }

        .badge.empty {
            background: rgba(255, 255, 255, 0.1);
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createStatsWidget();
});
