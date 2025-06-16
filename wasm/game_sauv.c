#include "game.h"

int generate_rnt() { return rand() % 10; }

Player * player_generator(char name[256]) 
{
    Player * p1 = malloc(sizeof(Player));
    strcpy(p1->name, name);
    
    p1->combat_skill = generate_rnt() + 10; // 10-19
    p1->endurance = generate_rnt() + 20; // 20-29
    p1->endurance_max = p1->endurance;
    
    p1->nbr_weapon = 0;
    memset(p1->tab_weapon, 0, sizeof(p1->tab_weapon));
    weapon_choice(p1);
    
    p1->nbr_discipline = 0;
    memset(p1->tab_discipline, 0, sizeof(p1->tab_discipline));
    discipline_choice(p1);

    memset(&p1->bag, 0, sizeof(p1->bag));
    p1->bag.gold = generate_rnt() + 10;
    
    return p1;
}

void weapon_choice(Player * p1)
{
    Weapons choice;
    while (1) {
        printf("-------------------PLAYER--------------------\n"
           "Choisi 6 Disciplines parmi les 10 suivantes :\n\n"
           "1- Dagger\n"
           "2- Spear\n"
           "3- Mace\n"
           "4- Short Sword\n"
           "5- Warhammer\n"
           "6- Sword\n"
           "7- Axe\n"
           "8- Quarterstaff\n"
           "9- Broadsword\n"
           "10- Bow\n"
           "\nNombre Arme(s) Possédé : %d\n"
        "---------------------------------------------\n"
        "--> ", p1->nbr_weapon);
        scanf("%d", (int *)&choice), choice--;
        getchar();
        system("cls");
        if (choice >= 0 && choice < 10 && p1->tab_weapon[choice] == false) {
            p1->tab_weapon[choice] = true;
            p1->nbr_weapon++;
            break;
        } else {
            printf("------------------------------------\n"
                   "| Choix invalide ou déjà possédé ! |\n"
                   "------------------------------------\n\n");
        }
    }
}

void discipline_choice(Player * p1)
{
    Disciplines choice;
    char * weapon_names[10] = {"Dagger", "Spear", 
                              "Mace", "Short Sword", 
                              "Warhammer", "Sword", 
                              "Axe", "Quarterstaff",
                              "Broadsword", "Bow"};

    while (p1->nbr_discipline != 6) {
        printf("-------------------PLAYER--------------------\n"
           "Choisi 6 Disciplines parmi les 10 suivantes :\n\n"
           "1- Camouflage\n"
           "2- Hunting\n"
           "3- Sixth Sense\n"
           "4- Tracking\n"
           "5- Weaponskill\n"
           "6- Healing\n"
           "7- Mindshield\n"
           "8- Mindblast\n"
           "9- Animal Kinship\n"
           "10- Mind Over Matter\n"
           "\nNombre Discipline(s) Possédé : %d\n"
        "---------------------------------------------\n"
        "--> ", p1->nbr_discipline);
        scanf("%d", (int *)&choice), choice--;// ?
        getchar();
        system("cls");
        if (choice >= 0 && choice < 10 && p1->tab_discipline[choice] == false) {
            p1->tab_discipline[choice] = true;
            p1->nbr_discipline++;
            if (choice == weaponskill) {
                p1->weaponskill_weapon = generate_rnt();
                printf("[Le Bonus s'appliquera a l'arme : %s]\n\n", weapon_names[p1->weaponskill_weapon]);
                if (p1->tab_weapon[p1->weaponskill_weapon] == true)
                    printf("[Arme Possédé, +2 en habilité en combat si équipé]\n\n");
            }
        } else {
            printf("------------------------------------\n"
                   "| Choix invalide ou déjà possédé ! |\n"
                   "------------------------------------\n\n");
        }
    }
}

void gain_gold(Player * p1, int amount)
{
    p1->bag.gold += amount;
    if (p1->bag.gold > GOLD_MAX) { 
        p1->bag.gold = GOLD_MAX;
        printf("[Votre Gold est au Max !]\n\n");
    }
}

void eat(Player * p1)
{
    if (p1->tab_discipline[hunting] == true) {
        printf("Pas besoin de manger");
        return;
    } else if (p1->bag.meals > 0) {
        p1->bag.meals--;
    } else {
        p1->endurance -= 3;
    }
}

void heal(Player * p1)
{
    if (p1->combat == false) {
        if (p1->bag.potions_healing > 0) {
            if (p1->endurance == p1->endurance_max) {
                printf("[Endurance déjà au Max !]\n\n");
                return;
            }
            p1->bag.potions_healing--;
            p1->endurance += 4;
            if (p1->endurance > p1->endurance_max) {
                p1->endurance = p1->endurance_max;
                printf("[Endurance au Max !]\n\n");
            }
        } else {
            printf("[Pas assez de Potions !]\n\n");
            return;
        }
    } else {
        printf("[Vous ne pouvez pas vous heal pendant un combat !]\n\n");
        return;
    }
}

// RC = ton HC – HC de l’ennemi (limites le RC entre –11 et +11 s’il dépasse)
// La table de combat
// Boucle jusqu’à ce que l’un des deux meure
// Dans un fichier (RC Tir Degats Ennemi Degats Heros)

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

int calcule_rc(int hab_hero, int hab_enemi)
{
    int rc = hab_hero - hab_enemi;
    if (rc < -11)
        rc = -11;
    if (rc > 11)
        rc = 11;
        return rc;
}

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