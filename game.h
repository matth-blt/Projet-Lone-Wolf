#ifndef GAME_H
#define GAME_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define WEAPON_MAX 2
#define RESOURCE_MAX 8
#define GOLD_MAX 50

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

typedef enum {
    dagger,
    spear,
    mace,
    short_sword,
    warhammer,
    sword,
    axe,
    quarterstaff,
    broadsword,
    bow
} Weapons;

typedef struct {
    char name[32];
    int endurance;
    int combat_skill;
    Bool tab_discipline[10];
    int nbr_discipline;
    Bool tab_weapon[10];
    int nbr_weapon;
    int weaponskill_weapon;
    struct Resources bag;
    Bool in_combat;
} Player;

typedef struct Resources {
    int gold;
    int meals;
    int potions_healing;
    int arrows;
} Resources;

int generate_rnt();

Player * player_generator(char name[256]);
void weapon_choice(Player * p1);
void discipline_choice(Player * p1);

void eating(Player * p1);
void healing(Player * p1);

void calcule_point(int rc, int nbr_rand, int * hero, int * enemi);

#endif