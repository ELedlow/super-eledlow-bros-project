import { findPlayers } from "../player.js";
import { Player } from "../traits/Player.js";
import { LevelTimer } from "../traits/LevelTimer.js";

function getPlayerTrait(entities) {
    for (const entity of findPlayers(entities)) {
        return entity.traits.get(Player);
    }
}

function getTimerTrait(entities) {
    for (const entity of entities) {
        if (entity.traits.has(LevelTimer)) {
            return entity.traits.get(LevelTimer);
        }
    }
}

export function createDashboardLayer(font, level) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;

    //const playerTrait = getPlayerTrait(level);
    const timerTrait = getTimerTrait(level.entities);

    return function drawDashboard(context) {
        const playerTrait = getPlayerTrait(level.entities);
        if (playerTrait === undefined) {
            return;
        }
        //time cannot be decimal. Took me an unessessary amount
        //of time to fix
        font.print(playerTrait.name.toString().toUpperCase(), context, 16, LINE1);
        font.print(playerTrait.score.toString().padStart(6, '0'), context, 16, LINE2);

        //font.print('@×' + playerTrait.lives.toString().padStart(2 ,'0'), context, 96, LINE1);
        font.print('@×' + playerTrait.coins.toString().padStart(2 ,'0'), context, 96, LINE2);

        font.print('WORLD', context, 182, LINE1);
        font.print(level.name.toUpperCase(), context, 190, LINE2);

        font.print('TIME', context, 268, LINE1);
        font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 273, LINE2);
    }
}