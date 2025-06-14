#include "game.h"

int generate_rnt() { return rand() % 10; }

Player * player_generator(char name[256]) 
{
    Player * p1 = malloc(sizeof(Player));
    strcpy(p1->name, name);
    p1->hability = generate_rnt() + 10; // 10-19
    p1->endurance = generate_rnt() + 20; // 20-29
    return p1;
}

Bool discipline_choice()
{
    Bool tab_discipline[10];
}
// RC = ton HC – HC de l’ennemi (limites le RC entre –11 et +11 s’il dépasse)
// La table de combat
// Boucle jusqu’à ce que l’un des deux meure
// Dans un fichier (RC Tir Degats Ennemi Degats Heros)


void calcule_point(int rc, int nbr_rand, int* hero,int* enemi){
    FILE * file = fopen("tab.txt", "r");
    
    if (file == NULL) {
        printf("Unable to open file <tab.txt>\n"), exit(EXIT_FAILURE);
    }

    char line[50];
    int rc_tab, nbr_rand_tab, hero_tmp, enemi_tmp;

    while (fgets(line, sizeof(line), file)) {
        sscanf(line, "%d %d %d %d", &rc_tab, &nbr_rand_tab, hero, enemi);

        if (sscanf(line, "%d %d %d %d", &rc_tab, &nbr_rand_tab, &enemi_tmp, &hero_tmp) == 4) {
            if (rc == rc_tab && nbr_rand == nbr_rand_tab) {
                *hero = hero_tmp;
                *enemi = enemi_tmp;
                fclose(file);
                return;
            }
        }

    }

    *hero=0;
    *enemi=0;
    fclose(file);
}