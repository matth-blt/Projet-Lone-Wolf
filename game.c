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