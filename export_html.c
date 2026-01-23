#include "export_html.h"

void start_section(char *filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename), exit(EXIT_FAILURE);
    }

    char line[LINE_SIZE];
    FILE *write_file_html = NULL;
    int nbr_section;
    char file_html[256];
    
    while (fgets(line, sizeof(line), file)) {
        //Détection de section
        char *section = strstr(line, "<section>");
        if (section != NULL) {
            end_section(write_file_html);
            sscanf(line, "<section>sect%d", &nbr_section);
            
            //Création du fichier HTML
            snprintf(file_html, sizeof(file_html), "./export/sect%d.html", nbr_section);

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

void end_section(FILE *write_file_html) {
    if (write_file_html != NULL) {
        fprintf(write_file_html, "\t</section>\n\t<script src=\"javascript.js\"></script>\n"
                                 "\t<script type=\"module\" src=\"../fight.js\"></script>\n"
                                 "\t<script type=\"module\" src=\"../addons.js\"></script>\n"
                                 "\t<script src=\"../stats_widget.js\"></script>\n"
                                 "\t</body>\n</html>\n");
        write_file_html = NULL;
    }
}

void link(char *line) {
    // Détection de la balise "a"
    char * balise = NULL;
    balise = strstr(line, "<a>");
    char chaine1[256], chaine2[512];
    if (balise != NULL) {
        
        strncpy(chaine1, balise, sizeof(chaine1) - 1);
        chaine1[sizeof(chaine1) - 1] = '\0';
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
        snprintf(chaine2, sizeof(chaine2), "<a href=\"sect%d.html\">", nbr);
        strncat(chaine2, chaine1 + 3, sizeof(chaine2) - strlen(chaine2) - 1);
        strncpy(balise, chaine2, LINE_SIZE - (balise - line) - 1);
    }
}

void html_verificator(char *line, int nbr_section) {
    // Rajoute un id pour la section
    char chaine[512];
    char temp[LINE_SIZE];
    if (strstr(line, "<section") != NULL) {
        strcpy(chaine, "<section id=\"");
        strcat(chaine, line + 9);
        strcpy(line, chaine);
        line[strlen(line) - 1] = '\0';
        snprintf(temp, LINE_SIZE, "%s\">sect%d\n", line, nbr_section);
        strncpy(line, temp, LINE_SIZE - 1);
        line[LINE_SIZE - 1] = '\0';
        return;
    }
    
    // Remplace les balises XML en HTML
    replace(line, "illustration", "div");
    replace(line, "instance", "img alt=\"image\"");

    // On met en plus la balise fermante
    if (strstr(line, "<choice") != NULL) {
        replace(line, "choice idref", "p id");
        line[strlen(line) - 1] = '\0';
        strncat(line, "</p>\n", LINE_SIZE - strlen(line) - 1);
    }

    replace(line, "footnotes", "div");
    replace(line, "footnote", "p");
    replace(line, "creator", "p");
    replace(line, "description", "p");
    replace(line, "meta", "div");
    replace(line, "footref", "href");
    replace(line, "idref", "id");
    replace(line, "bookref", "href");
}

void replace(char *line, char *old_word, char *new_word) {
    char buffer[LINE_SIZE];
    char *position;
    size_t old_word_len = strlen(old_word);

    // Boucle pour remplacer TOUTES les occurrences
    while ((position = strstr(line, old_word)) != NULL) {
        size_t before = position - line;

        // Copie la partie avant le mot à remplacer
        strncpy(buffer, line, before);
        buffer[before] = '\0';

        // Ajoute le nouveau mot
        strncat(buffer, new_word, LINE_SIZE - strlen(buffer) - 1);
        
        // Ajoute la fin de la ligne originale
        strncat(buffer, position + old_word_len, LINE_SIZE - strlen(buffer) - 1);

        // Copie le résultat dans line
        strncpy(line, buffer, LINE_SIZE - 1);
        line[LINE_SIZE - 1] = '\0';
    }
}
