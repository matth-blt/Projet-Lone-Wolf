#include "export_html.h"

int main(int argc, char *argv[]) {
    char filename[256];

    if (argc > 3) {
        printf("Trop d'arguments !");
        exit(1);
    }

    for (int i = 1 ; i < argc ; i++) {
        if (strcmp(argv[i], "--file") == 0) {
            strcpy(filename, argv[i + 1]);
        } 
    }
    start_section(filename);

    return 0;
}