#ifndef EXPORT_HTML_H
#define EXPORT_HTML_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define LINE_SIZE 2000

/**
 * @brief lit les sections dans le fichier .data et génére un fichier html
 *
 * @param filename chemin d'accès vers le fichier .data
*/
void start_section(char * filename);

/**
 * @brief ajoute la balise body et html en fin de fichier
 *
 * @param write_file_html pointeur sur un fichier html
*/
void end_section(FILE * write_file_html);



#endif