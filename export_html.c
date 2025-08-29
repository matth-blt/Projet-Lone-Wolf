#include "export_html.h"

void start_section(char * filename)
{
    FILE * file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename), exit(EXIT_FAILURE);
    }

    char line[LINE_SIZE];
    FILE * write_file_html = NULL;
    int nbr_section;
    char file_html[256];
    
    while (fgets(line, sizeof(line), file)) {
        //Détection de section
        char * section = strstr(line, "<section>");
        if (section != NULL) {
            end_section(write_file_html);
            sscanf(line, "<section>sect%d", &nbr_section);
            
            //Création du fichier HTML
            sprintf(file_html, "./export/sect%d.html", nbr_section);

            write_file_html = fopen(file_html, "w");
            if (!write_file_html) {
                perror("Erreur ouverture fichier HTML");
                exit(1);
            }

            //Écriture du header HTML
            fprintf(write_file_html,
                "<!DOCTYPE html>\n"
                "<html lang=\"en\">\n\t<head>\n"
                "\t\t<title>sect%d</title>\n"
                "\t\t<meta charset=\"utf-8\"/>\n"
                "\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n"
                "\t</head>\n\t<body>\n",
                nbr_section);
        }

        //Écriture du contenu HTML
        if (write_file_html != NULL) {
            link(line);
            html_verificator(line, nbr_section);
            fprintf(write_file_html, "\t%s", line);
        }

    }

    end_section(write_file_html);
    fclose(write_file_html);
    fclose(file);
}


// ------------------------------------------------------------------

void end_section(FILE * write_file_html)
{
    if (write_file_html != NULL) {
        fprintf(write_file_html, "\t</section>\n\t<script src=\"javascript.js\"></script>\n"
                                 "\t<script type=\"module\" src=\"../fight.js\"></script>\n"
                                 "\t<script type=\"module\" src=\"../addons.js\"></script>\n"
                                 "\t</body>\n</html>\n");
        write_file_html = NULL;
    }
}

// ------------------------------------------------------------------

void link(char * line)
{
    // Détection de la balise "a"
    char * balise = NULL;
    balise = strstr(line, "<a>");
    char chaine1[256], chaine2[512];
    if (balise != NULL) {
        
        strcpy(chaine1, balise);
        char * temp = chaine1;
        int nbr;
        while (*temp) {
        // Compare les 7 premiers char
            if (strncasecmp(temp, "turn to", 7) == 0) {
                if (sscanf(temp + 7, "%d", &nbr) == 1)
                    break;
            } else if (strncasecmp(temp, "turning to", 10) == 0) {
                if (sscanf(temp + 10, "%d", &nbr) == 1)
                    break;
            }
            temp++;
        }

        // Ajoute le href dans la ligne  
        sprintf(chaine2, "<a href=\"sect%d.html\">", nbr);
        strcat(chaine2, chaine1 + 3);
        strcpy(balise, chaine2);
    }
}

// ------------------------------------------------------------------

void html_verificator(char * line, int nbr_section)
{
    // Rajoute un id pour la section
    char chaine[512]; 
    if (strstr(line, "<section") != NULL) {
        strcpy(chaine, "<section id=\"");
        strcat(chaine, line + 9);
        strcpy(line, chaine);
        line[strlen(line) - 1] = '\0';
        sprintf(line, "%s\">sect%d\n", line, nbr_section);
        return;
    }
    
    // Remplace les balises XML en HTML
    for (int i = 0 ; i < 2 ; i++) {
        replace(line, "illustration", "div");
        replace(line, "instance", "img alt=\"image\"");

        // On met en plus la balise fermante
        if (strstr(line, "<choice") != NULL) {
            replace(line, "choice idref", "p id");
            line[strlen(line) - 1] = '\0';
            strcat(line, "</p>\n");
        }

        replace(line, "footnotes", "div");
        replace(line, "footnote", "p");
        replace(line, "creator", "p");
        replace(line, "creator", "p");
        replace(line, "description", "p");
        replace(line, "meta", "div");
        replace(line, "footref", "href");
        replace(line, "idref", "id");
        replace(line, "bookref", "href");
    }
}

// ------------------------------------------------------------------

void replace(char * line, char * old_word, char * new_word) 
{
    char buffer[LINE_SIZE];
    // Pointeur a la fin du mot a remplacer (première occurence)
    char * position = strstr(line, old_word);

    if (position == NULL)
        return;

    // Calcule la distance entre le début de la ligne et position
    size_t before = position - line;
    size_t old_word_len = strlen(old_word);

    // Ajoute line avant le mot à remplacer dans buffer
    strncpy(buffer, line, before);
    buffer[before] = '\0';

    strcat(buffer, new_word);
    // Ajoute la fin de la ligne originale à la suite de buffer
    strcat(buffer, position + old_word_len);

    strncpy(line, buffer, LINE_SIZE - 1);
    line[LINE_SIZE - 1] = '\0';
}
