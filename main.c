#include "export_html.h"
#include "game.h"

int main(int argc, char *argv[])
{
    srand(time(NULL));
    char filename[256];
    Player * p1 = NULL;

    if (argc > 5) {
        printf("Trop d'arguments !");
        exit(EXIT_FAILURE);
    }
    
    int found = 0;
    for (int i = 1 ; i < argc ; i++) {
        if (strcmp(argv[i], "--file") == 0) {
            strcpy(filename, argv[i + 1]);
            found++;
        } 
        if (strcmp(argv[i], "--name") == 0) {
            p1 = player_generator(argv[i + 1]);
            found++;
        }
    }
    if (found != 2) printf("Manque des commandes !"), exit(1);

    printf("nom : %s\n"
           "habilité : %d\n"
           "endurance : %d\n", p1->name, p1->hability, p1->endurance);
    // start_section(filename);

    return EXIT_SUCCESS ;
}