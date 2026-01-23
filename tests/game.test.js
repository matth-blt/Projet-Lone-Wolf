/**
 * Tests pour la logique de jeu (Game class)
 */

// Fonctions à tester (extraites de player_creation.js)
const WEAPON_MAX = 2;

const Disciplines = {
    CAMOUFLAGE: 0, HUNTING: 1, SIXTH_SENSE: 2, TRACKING: 3,
    WEAPONSKILL: 4, HEALING: 5, MINDSHIELD: 6, MINDBLAST: 7,
    ANIMAL_KINSHIP: 8, MIND_OVER_MATTER: 9
};

function generateRnt() {
    return Math.floor(Math.random() * 10);
}

function playerGenerator(name) {
    const player = {
        name: name,
        endurance: generateRnt() + 20,
        enduranceMax: 0,
        combatSkill: generateRnt() + 10,
        disciplines: new Array(10).fill(false),
        nbrDiscipline: 0,
        weapons: new Array(10).fill(false),
        nbrWeapon: 0,
        weaponskillWeapon: -1,
        bag: {
            gold: generateRnt() + 10,
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

function chooseWeapon(player, weaponIndex) {
    if (player.nbrWeapon >= WEAPON_MAX) return false;

    if (weaponIndex >= 0 && weaponIndex < 10 && !player.weapons[weaponIndex]) {
        player.weapons[weaponIndex] = true;
        player.nbrWeapon++;
        return true;
    }
    return false;
}

function chooseDiscipline(player, disciplineIndex) {
    if (player.nbrDiscipline >= 6) return false;

    if (disciplineIndex >= 0 && disciplineIndex < 10 && !player.disciplines[disciplineIndex]) {
        player.disciplines[disciplineIndex] = true;
        player.nbrDiscipline++;
        return true;
    }
    return false;
}

// === TESTS ===
import { describe, it, expect } from 'vitest';

describe('Game Module', () => {
    describe('playerGenerator', () => {
        it('crée un joueur avec le bon nom', () => {
            const player = playerGenerator("TestHero");
            expect(player.name).toBe("TestHero");
        });

        it('génère une endurance entre 20 et 29', () => {
            for (let i = 0; i < 50; i++) {
                const player = playerGenerator("Test");
                expect(player.endurance).toBeGreaterThanOrEqual(20);
                expect(player.endurance).toBeLessThanOrEqual(29);
            }
        });

        it('génère un combat skill entre 10 et 19', () => {
            for (let i = 0; i < 50; i++) {
                const player = playerGenerator("Test");
                expect(player.combatSkill).toBeGreaterThanOrEqual(10);
                expect(player.combatSkill).toBeLessThanOrEqual(19);
            }
        });

        it('initialise enduranceMax égal à endurance', () => {
            const player = playerGenerator("Test");
            expect(player.enduranceMax).toBe(player.endurance);
        });

        it('génère de l\'or entre 10 et 19', () => {
            for (let i = 0; i < 50; i++) {
                const player = playerGenerator("Test");
                expect(player.bag.gold).toBeGreaterThanOrEqual(10);
                expect(player.bag.gold).toBeLessThanOrEqual(19);
            }
        });
    });

    describe('chooseWeapon', () => {
        it('ajoute une arme au joueur', () => {
            const player = playerGenerator("Test");
            const result = chooseWeapon(player, 0);
            expect(result).toBe(true);
            expect(player.weapons[0]).toBe(true);
            expect(player.nbrWeapon).toBe(1);
        });

        it('refuse si le joueur a déjà 2 armes', () => {
            const player = playerGenerator("Test");
            chooseWeapon(player, 0);
            chooseWeapon(player, 1);
            const result = chooseWeapon(player, 2);
            expect(result).toBe(false);
            expect(player.nbrWeapon).toBe(2);
        });

        it('refuse une arme déjà possédée', () => {
            const player = playerGenerator("Test");
            chooseWeapon(player, 0);
            const result = chooseWeapon(player, 0);
            expect(result).toBe(false);
        });
    });

    describe('chooseDiscipline', () => {
        it('ajoute une discipline au joueur', () => {
            const player = playerGenerator("Test");
            const result = chooseDiscipline(player, 0);
            expect(result).toBe(true);
            expect(player.disciplines[0]).toBe(true);
            expect(player.nbrDiscipline).toBe(1);
        });

        it('refuse si le joueur a déjà 6 disciplines', () => {
            const player = playerGenerator("Test");
            for (let i = 0; i < 6; i++) {
                chooseDiscipline(player, i);
            }
            const result = chooseDiscipline(player, 6);
            expect(result).toBe(false);
        });
    });
});
