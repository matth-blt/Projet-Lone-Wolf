/**
 * Tests pour les addons (repas, soins, or)
 */

const GOLD_MAX = 50;

const Disciplines = {
    HUNTING: 1
};

// Fonctions à tester (extraites de addons.js)
function gainGold(player, amount) {
    player.bag.gold += amount;
    if (player.bag.gold > GOLD_MAX) {
        player.bag.gold = GOLD_MAX;
        return "[Gold limit reached !]";
    }
    return null;
}

function eat(player, choice) {
    if (player?.disciplines?.[Disciplines.HUNTING]) {
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

function heal(player) {
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

// Helper pour créer un joueur test
function createTestPlayer() {
    return {
        endurance: 25,
        enduranceMax: 25,
        disciplines: new Array(10).fill(false),
        bag: {
            gold: 20,
            meals: 2,
            potionsHealing: 1
        },
        combat: false
    };
}

// === TESTS ===
import { describe, it, expect } from 'vitest';

describe('Addons Module', () => {
    describe('gainGold', () => {
        it('ajoute de l\'or au joueur', () => {
            const player = createTestPlayer();
            gainGold(player, 10);
            expect(player.bag.gold).toBe(30);
        });

        it('plafonne à 50 gold max', () => {
            const player = createTestPlayer();
            const result = gainGold(player, 100);
            expect(player.bag.gold).toBe(50);
            expect(result).toBe("[Gold limit reached !]");
        });

        it('retourne null si pas de dépassement', () => {
            const player = createTestPlayer();
            const result = gainGold(player, 5);
            expect(result).toBeNull();
        });
    });

    describe('eat', () => {
        it('consomme un repas si disponible', () => {
            const player = createTestPlayer();
            const result = eat(player, true);
            expect(player.bag.meals).toBe(1);
            expect(result).toBe("[-1 Food]");
        });

        it('perd 3 endurance si pas de repas', () => {
            const player = createTestPlayer();
            player.bag.meals = 0;
            const result = eat(player, true);
            expect(player.endurance).toBe(22);
            expect(result).toBe("[-3 Endurance]");
        });

        it('perd 3 endurance si skip', () => {
            const player = createTestPlayer();
            const result = eat(player, false);
            expect(player.endurance).toBe(22);
        });

        it('pas besoin de manger avec discipline Hunting', () => {
            const player = createTestPlayer();
            player.disciplines[Disciplines.HUNTING] = true;
            const result = eat(player, true);
            expect(result).toContain("Hunter discipline");
            expect(player.bag.meals).toBe(2); // pas consommé
        });
    });

    describe('heal', () => {
        it('soigne +4 endurance', () => {
            const player = createTestPlayer();
            player.endurance = 20;
            heal(player);
            expect(player.endurance).toBe(24);
            expect(player.bag.potionsHealing).toBe(0);
        });

        it('ne dépasse pas enduranceMax', () => {
            const player = createTestPlayer();
            player.endurance = 23;
            heal(player);
            expect(player.endurance).toBe(25); // max
        });

        it('refuse pendant un combat', () => {
            const player = createTestPlayer();
            player.combat = true;
            player.endurance = 20;
            const result = heal(player);
            expect(result).toBe("You can't heal during a fight !");
            expect(player.endurance).toBe(20); // pas changé
        });

        it('refuse si déjà au max', () => {
            const player = createTestPlayer();
            const result = heal(player);
            expect(result).toBe("Endurance is at maximum !");
        });

        it('refuse si pas de potion', () => {
            const player = createTestPlayer();
            player.bag.potionsHealing = 0;
            player.endurance = 20;
            const result = heal(player);
            expect(result).toBe("Not enough Potions !");
        });
    });
});
