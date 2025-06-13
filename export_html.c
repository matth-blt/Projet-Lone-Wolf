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
                "<html>\n\t<head>\n"
                "\t\t<title>sect%d</title>\n"
                "\t\t<meta charset=\"utf-8\" />\n"
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
        fprintf(write_file_html, "\t</section>\n\t<script type=\"text/javascript\" src=\"javascript.js\"></script>"
                                 "\n\t</body>\n</html>\n");
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
    char chaine[512];
    if (strstr(line, "<creator>") != NULL || strstr(line, "<description>") != NULL) {
        char * balise_debut = strstr(line, "<creator>");
        if (!balise_debut) 
            balise_debut = strstr(line, "<description>");

        char * start = strchr(balise_debut, '>');
        if (!start) 
            return;
        start++;

        char * end = strstr(start, "</");
        if (!end) 
            return;
            
        int i = 0;
        while (start < end && i < sizeof(chaine) - 1) {
            chaine[i++] = *start++;
        } 
        chaine[i] = '\0';

        sprintf(line, "<p>%s</p>\n", chaine);
        return;
    } 
    // else if (strstr(line, "<instance") != NULL) {
    //     strcpy(chaine, "<img ");
    //     strcat(chaine, line + 10);
    //     strcpy(line, chaine);
    //     return;
    // } 
    else if (strstr(line, "<choice") != NULL) {
        strcpy(chaine, "<p id");
        strcat(chaine, line + 13);
        strcpy(line, chaine);
        line[strlen(line) - 1] = '\0';
        strcat(line, "</p>\n");
        return;
    } else if (strstr(line, "<section") != NULL) {
        strcpy(chaine, "<section id=\"");
        strcat(chaine, line + 9);
        strcpy(line, chaine);
        line[strlen(line) - 1] = '\0';
        sprintf(line, "%s\">sect%d\n", line, nbr_section);
        return;
    } 

    // char * token = strtok(line, " \n");
    // if (strstr(token, "illustration") != NULL)
    //     strcpy(token, "<div");
    //     strcat(token, line + 13);
    //     strcpy(line,token);
    replace_in_line(line, "illustration", "div");
    replace_in_line(line, "instance", "img");
    replace_in_line(line, "choice idref", "p id");
    replace_in_line(line, "choice idref", "p id");

}


void replace_in_line(char *line, const char *old, const char *new) {
    char buffer[LINE_SIZE];
    char *pos = strstr(line, old);

    if (pos == NULL) return;  // Mot non trouvé

    // Calcul des positions
    size_t before = pos - line;
    size_t old_len = strlen(old);
    // size_t new_len = strlen(new);

    // Copie avant le mot à remplacer
    strncpy(buffer, line, before);
    buffer[before] = '\0';

    // Ajout du mot de remplacement
    strcat(buffer, new);

    // Ajout de ce qu'il y a après le mot à remplacer
    strcat(buffer, pos + old_len);

    // Copie finale dans la ligne d'origine
    strncpy(line, buffer, LINE_SIZE - 1);
    line[LINE_SIZE - 1] = '\0';
}
