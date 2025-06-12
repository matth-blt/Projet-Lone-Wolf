#include "export_html.h"

//Lire le fichier section HTML
FILE * start_section(char * filename)
{
    FILE * file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename), exit(EXIT_FAILURE);
    }
    char line[LINE_SIZE];
    int n = 0;
    while (fgets(line, sizeof(line), file)) {
        char * section = strstr(line,"<section>");
        int nbr_section;
        if (section != NULL) {
            sscanf(line, "<section>sect%d", &nbr_section);
            n++;
        } else if (n == 0) {
            perror("Erreur Lecture Section !");
            exit(1);
        }

        char file_html[256];
        strcpy(file_html, html_file_generator(nbr_section));
        FILE * write_file_html = fopen(file_html, "a");
        fprintf(write_file_html, line);
        fclose(write_file_html);

        // fin section
        // for (int i = 0 ; i < LINE_SIZE ; i++) {
        //     if (line[i] == line[i + 1] == line[i + 2] == " ")
        //         line[i] = '\0';
        // }
        if (strlen(line)<=2) {
            break;    
        }
    }

    return file;
}


char * html_file_generator(int section_nbr)
{
    char * name = malloc(sizeof(char) * 256);
    sprintf(name, "sect%d.html", section_nbr);
    printf("nom html : %s", name);

    char command_line[256];
    sprintf(command_line, "type nul > ./export/%s", name);
    system(command_line);

    return name;
}

//Fermer le fichier
void end_section(FILE * file)
{
    fclose(file);
}

//Traiter un choice
//Trouver le nom de la section --> ouvrir celle choisie

