UNAME_S := $(shell uname 2>/dev/null || echo Unknown)
ifeq ($(OS),Windows_NT)
    OS_DETECTED := windows
else ifeq ($(findstring MINGW,$(UNAME_S)),MINGW)
    OS_DETECTED := windows
else ifeq ($(UNAME_S),Linux)
    OS_DETECTED := linux
else ifeq ($(UNAME_S),Darwin)
    OS_DETECTED := macos
else
    OS_DETECTED := unknown
endif

CC = gcc
CFLAGS = -Wall
LDFLAGS = -lm

SRC = main.c export_html.c game.c
OBJ = $(SRC:.c=.o)

ifeq ($(OS_DETECTED),windows)
    EXE = projet.exe
    RM = del /Q
    RUN = ./$(EXE)
else
    EXE = projet
    RM = rm -f
    RUN = ./$(EXE)
endif

all: $(EXE)

$(EXE): $(OBJ)
	$(CC) $(OBJ) -o $(EXE) $(LDFLAGS)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
web:
	$(RM) .\export\*.html
	$(RUN) --file ./ressources/02fotw.data --name "LE GOAT DES ECHECS"
hsup:
	$(RM) .\export\*.html
clean:
	$(RM) $(OBJ) $(EXE)

.PHONY: all web hsup clean
