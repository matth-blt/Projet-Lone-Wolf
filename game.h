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

typedef enum {
    ticket,
    seal_of_hammerdal,
    magic_spear,
    crystal_star_pendant,
    red_pass,
    white_pass,
    documents
} Special_items;

typedef struct {
    int gold;
    int meals;
    int potions_healing;
    int arrows;
    Bool special_items[7];
} Resources;

typedef struct {
    char name[32];
    int endurance;
    int endurance_max;
    int combat_skill;
    Bool tab_discipline[10];
    int nbr_discipline;
    Bool tab_weapon[10];
    int nbr_weapon;
    int weaponskill_weapon;
    Resources bag;
    Bool combat;
} Player;

int generate_rnt();

Player * player_generator(char name[256]);
void weapon_choice(Player * p1);
void discipline_choice(Player * p1);
// void discipline_choice(Player * p1, int choice);

void eat(Player * p1);
void heal(Player * p1);

void calcule_point(int rc, int nbr_rand, int * hero, int * enemi);
int calcule_rc(int hab_hero, int hab_enemi);
void combat(Player * p1, Player * p2);

#endif