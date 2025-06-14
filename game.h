#ifndef GAME_H
#define GAME_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef enum {
    false,
    true
} Bool;

typedef enum {
    camouflage,
    hunting,
    sixth_sense,
    tracking,
    weaponskill,
    healing,
    mindshield,
    mindblast,
    animal_kinship,
    mind_over_matter
} Disciplines;

typedef struct {
    char name[32];
    int endurance;
    int hability;
    Bool tab_discipline[10];
    int nbr_discipline;
} Player;

int generate_rnt();
Player * player_generator(char name[256]);
void calcule_point(int rc, int nbr_rand, int* hero,int* enemi);

#endif