/**
 * Tests pour la logique de combat
 * Extrait de fight.js pour tests unitaires
 */

// Table de combat (copiée de fight.js pour tests isolés)
const combatTable = [
    [-11, 0, 0, 11], [-11, 1, 0, 10], [-11, 2, 0, 10], [-11, 3, 0, 9],
    [-11, 4, 0, 8], [-11, 5, 1, 8], [-11, 6, 1, 7], [-11, 7, 2, 6],
    [-11, 8, 3, 5], [-11, 9, 4, 5], [0, 0, 7, 2], [0, 1, 8, 2],
    [0, 2, 9, 2], [0, 3, 10, 1], [0, 4, 11, 0], [0, 5, 13, 0],
    [0, 6, 14, 0], [0, 7, 16, 0], [0, 8, 18, 0], [0, 9, 20, 0],
    [11, 0, 24, 0], [11, 1, 26, 0], [11, 2, 28, 0], [11, 3, 30, 0],
    [11, 4, 32, 0], [11, 5, 34, 0], [11, 6, 36, 0], [11, 7, 38, 0],
    [11, 8, 40, 0], [11, 9, 42, 0]
];

// Fonctions à tester (copiées de fight.js)
function calculeRc(habHero, habEnemi) {
    let rc = habHero - habEnemi;
    return Math.max(-11, Math.min(11, rc));
}

function calculePoint(rc, nbrRand) {
    const entry = combatTable.find(
        ([tabRc, tabRand]) => tabRc === rc && tabRand === nbrRand
    );
    return entry ? { hero: entry[3], enemi: entry[2] } : { hero: 0, enemi: 0 };
}

function generateRnt() {
    return Math.floor(Math.random() * 10);
}

// === TESTS ===
import { describe, it, expect } from 'vitest';

describe('Fight Module', () => {
    describe('calculeRc', () => {
        it('calcule correctement la différence de skill', () => {
            expect(calculeRc(15, 10)).toBe(5);
            expect(calculeRc(10, 15)).toBe(-5);
            expect(calculeRc(20, 20)).toBe(0);
        });

        it('borne le RC entre -11 et 11', () => {
            expect(calculeRc(30, 10)).toBe(11);  // 20 borné à 11
            expect(calculeRc(5, 25)).toBe(-11);  // -20 borné à -11
        });
    });

    describe('calculePoint', () => {
        it('retourne les bons dégâts pour RC=0', () => {
            const result = calculePoint(0, 0);
            expect(result.hero).toBe(2);
            expect(result.enemi).toBe(7);
        });

        it('retourne les bons dégâts pour RC=11 (max avantage)', () => {
            const result = calculePoint(11, 9);
            expect(result.hero).toBe(0);
            expect(result.enemi).toBe(42);
        });

        it('retourne les bons dégâts pour RC=-11 (max désavantage)', () => {
            const result = calculePoint(-11, 0);
            expect(result.hero).toBe(11);
            expect(result.enemi).toBe(0);
        });

        it('retourne {0,0} pour entrée invalide', () => {
            const result = calculePoint(99, 99);
            expect(result.hero).toBe(0);
            expect(result.enemi).toBe(0);
        });
    });

    describe('generateRnt', () => {
        it('génère des nombres entre 0 et 9', () => {
            for (let i = 0; i < 100; i++) {
                const rnt = generateRnt();
                expect(rnt).toBeGreaterThanOrEqual(0);
                expect(rnt).toBeLessThanOrEqual(9);
            }
        });
    });
});
