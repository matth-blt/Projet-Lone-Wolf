class Addons {
    static GOLD_MAX = 50;
    static RESOURCE_MAX = 8;

    static gainGold(player, amount) {
        player.bag.gold += amount;
        if (player.bag.gold > Addons.GOLD_MAX) {
            player.bag.gold = Addons.GOLD_MAX;
            return "[Votre Or est au maximum !]";
        }
        return null;
    }

    static eat(player) {
        if (player.tabDiscipline[Game.Disciplines.HUNTING]) {
            return "Pas besoin de manger";
        } else if (player.bag.meals > 0) {
            player.bag.meals--;
            return null;
        } else {
            player.endurance -= 3;
            return "Vous n'avez plus de nourriture ! -3 Endurance";
        }
    }

    static heal(player) {
        if (player.combat) {
            return "Vous ne pouvez pas vous soigner pendant un combat !";
        }
        
        if (player.endurance === player.enduranceMax) {
            return "Endurance déjà au maximum !";
        }
        
        if (player.bag.potionsHealing > 0) {
            player.bag.potionsHealing--;
            player.endurance = Math.min(player.endurance + 4, player.enduranceMax);
            
            if (player.endurance === player.enduranceMax) {
                return "Endurance au maximum !";
            }
            return null;
        }
        return "Pas assez de Potions !";
    }
}

export default Addons;