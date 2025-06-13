#ifndef GAME_H
#define GAME_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef enum {
    sixth_sense,
    camouflage, 
    healing, 
    weapon_skill, 
    mind_shield, 
    animal_kinship, 
    num_disciplines
} Skills;

typedef struct {
    char name[32];
    int endurance;
    int hability;
    int gold;
    int skills[8];
    char * items[20];
    int nbr_items;
} Player;

int generate_rnt();
Player * player_generator(char name[256]) ;

#endif