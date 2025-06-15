#include "game.h"
#include <emscripten.h>

// ------------------------------------------------------------------

void update_display(char msg[128])
{
    char script[256];
    sprintf(script, "updateDisplay('%s')", msg);
    emscripten_run_script(script);
}

// ------------------------------------------------------------------

void init_random() { srand(time(NULL)); }
int generate_rnt() { return rand() % 10; }

// ------------------------------------------------------------------

Player * player_generator(char name[256]) 
{
    Player * p1 = malloc(sizeof(Player));
    strcpy(p1->name, name);
    
    p1->combat_skill = generate_rnt() + 10;
    p1->endurance = generate_rnt() + 20;
    p1->endurance_max = p1->endurance;
    
    print_player_attribut(p1);

    p1->nbr_weapon = 0;
    memset(p1->tab_weapon, 0, sizeof(p1->tab_weapon));
    
    p1->nbr_discipline = 0;
    memset(p1->tab_discipline, 0, sizeof(p1->tab_discipline));

    memset(&p1->bag, 0, sizeof(p1->bag));
    p1->bag.gold = generate_rnt() + 10;
    
    return p1;
}

// ------------------------------------------------------------------

void print_player_attribut(Player * p1)
{
    char combat_skill_print[128];
    sprintf(combat_skill_print, "Combat Skill : %d", p1->combat_skill);
    update_display(combat_skill_print);

    char endurance_skill_print[128];
    sprintf(endurance_skill_print, "Endurance : %d -> Endurance Max : %d", p1->endurance, p1->endurance_max);
    update_display(endurance_skill_print);
}

// ------------------------------------------------------------------

void weapon_choice(Player * p1, int choice) 
{
    char * weapon_names[10] = {"Dagger", "Spear", "Mace", "Short Sword", 
                              "Warhammer", "Sword", "Axe", "Quarterstaff",
                              "Broadsword", "Bow"};
    if (choice >= 0 && choice < 10 && p1->tab_weapon[choice] == false) {
        p1->tab_weapon[choice] = true;
        p1->nbr_weapon++;

        char msg[128];
        sprintf(msg, "Arme %s ajoutée. Total : %d/2", weapon_names[choice], p1->nbr_weapon);

        char script[256];
        sprintf(script, "updateDisplay('%s')", msg);
        emscripten_run_script(script);
    } else {
        emscripten_run_script("updateDisplay('Choix invalide ou déjà possédé !')");
    }
}

// ------------------------------------------------------------------

void discipline_choice(Player * p1, int choice)
{
    char * weapon_names[10] = {"Dagger", "Spear", "Mace", "Short Sword", 
                              "Warhammer", "Sword", "Axe", "Quarterstaff",
                              "Broadsword", "Bow"};
    
    choice--;
    if (p1->nbr_discipline >= 6) {
        emscripten_run_script("updateDisplay('Vous avez déjà choisi 6 disciplines.')");
        return;
    }
    
    if (choice >= 0 && choice < 10 && p1->tab_discipline[choice] == false) {
        p1->tab_discipline[choice] = true;
        p1->nbr_discipline++;
        char msg[256];
        sprintf(msg, "Discipline %d ajoutée. Total : %d/6", choice + 1, p1->nbr_discipline);

        char script[256];
        sprintf(script, "updateDisplay('%s')", msg);
        emscripten_run_script_string(script);

        
        if (choice == weaponskill) {
            p1->weaponskill_weapon = generate_rnt();
            sprintf(msg, "[Le Bonus s'appliquera à l'arme : %s]", weapon_names[p1->weaponskill_weapon]);
            char script2[256];
            sprintf(script2, "updateDisplay('%s')", msg);
            emscripten_run_script_string(script2);
            if (p1->tab_weapon[p1->weaponskill_weapon]) {
                emscripten_run_script("updateDisplay('[Arme Possédée, +2 en habilité en combat si équipé]')");
            }
        }
        
        if (p1->nbr_discipline == 6) {
            emscripten_run_script("onDisciplinesComplete()");
        }
    } else {
        emscripten_run_script("updateDisplay('Choix invalide ou déjà possédé !')");
    }
}

// ------------------------------------------------------------------

void gain_gold(Player * p1, int amount)
{
    p1->bag.gold += amount;
    if (p1->bag.gold > GOLD_MAX) { 
        p1->bag.gold = GOLD_MAX;
        emscripten_run_script("updateDisplay('[Votre Gold est au Max !]')");
    }
}

// ------------------------------------------------------------------

void eat(Player * p1)
{
    if (p1->tab_discipline[hunting] == true) {
        emscripten_run_script("updateDisplay('[Pas besoin de manger, car vous avez la discipline hunting]')");
        return;
    } else if (p1->bag.meals > 0) {
        p1->bag.meals--;
    } else {
        p1->endurance -= 3;
    }
}

// ------------------------------------------------------------------

void heal(Player * p1)
{
    if (p1->combat == false) {
        if (p1->bag.potions_healing > 0) {
            if (p1->endurance == p1->endurance_max) {
                emscripten_run_script("updateDisplay('[Endurance déjà au Max !]')");
                return;
            }
            p1->bag.potions_healing--;
            p1->endurance += 4;
            if (p1->endurance > p1->endurance_max) {
                p1->endurance = p1->endurance_max;
                emscripten_run_script("updateDisplay('[Endurance au Max !]')");
            }
        } else {
            emscripten_run_script("updateDisplay('[Pas assez de Potions !]')");
            return;
        }
    } else {
        emscripten_run_script("updateDisplay('[Vous ne pouvez pas vous heal pendant un combat !]')");
        return;
    }
}

// ------------------------------------------------------------------

void calcule_point(int rc, int nbr_rand, int * hero, int * enemi)
{
    FILE * file = fopen("./ressources/tab.txt", "r");
    
    if (file == NULL) {
        printf("Unable to open file <tab.txt>\n"), exit(EXIT_FAILURE);
    }

    char line[50];
    int rc_tab, nbr_rand_tab, hero_tmp, enemi_tmp;

    while (fgets(line, sizeof(line), file)) {
        if (sscanf(line, "%d %d %d %d", &rc_tab, &nbr_rand_tab, &enemi_tmp, &hero_tmp) == 4) {
            if (rc == rc_tab && nbr_rand == nbr_rand_tab) {
                *hero = hero_tmp;
                *enemi = enemi_tmp;
                fclose(file);
                return;
            }
        }
    }

    *hero = 0;
    *enemi = 0;
    fclose(file);
}

// ------------------------------------------------------------------

int calcule_rc(int hab_hero, int hab_enemi)
{
    int rc = hab_hero - hab_enemi;
    if (rc < -11)
        rc = -11;
    if (rc > 11)
        rc = 11;
        return rc;
}

// ------------------------------------------------------------------

void combat(Player * p1, Player * p2)
{
    int rc, nbr, j1, j2; // j1 → degat subit pour p1 
    rc = calcule_rc(p1->combat_skill, p2->combat_skill); //les Habilités
    while (p1->endurance > 0 && p2->endurance > 0) {
        nbr = generate_rnt();
        calcule_point(rc, nbr, &j1, &j2);
        p1->endurance -= j1;
        p2->endurance -= j2;
    }
}