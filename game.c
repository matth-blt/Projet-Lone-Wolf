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