#include "game.h"

int generate_rnt() { return rand() % 10; }

Player * player_generator(char name[256]) 
{
    Player * p1 = malloc(sizeof(Player));
    strcpy(p1->name, name);
    p1->hability = generate_rnt() + 10;
    p1->endurance = generate_rnt() + 20;
    return p1;
}
//RC = ton HC – HC de l’ennemi (limites le RC entre –11 et +11 s’il dépasse)
//chiffre aléatoire de 0 à 9
// la table de combat
// Boucle jusqu’à ce que l’un des deux meure
// dans un fichier (RC Tir DegatsEnnemi DegatsHeros)