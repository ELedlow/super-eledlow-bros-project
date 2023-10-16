import { Matrix } from "../math.js";
import { Entity } from "../Entity.js";
import { LevelTimer } from "../traits/LevelTimer.js";
import { Trigger } from "../traits/Trigger.js";
import { Level } from "../Level.js";
import { createSpriteLayer } from "../layers/sprites.js";
import { createBackgroundLayer } from "../layers/Background.js";
import { loadMusicSheet } from "./music.js";
import { loadSpriteSheet } from "./sprite.js";
import { loadJSON } from "../loaders.js";

function createTimer() {
    const timer = new Entity();
    timer.addTrait(new LevelTimer());
    return timer;
}

function loadPattern(name) {
    return loadJSON(`./sprites/patterns/${name}.json`)
}

function setupBehavior(level) {
    const timer = createTimer();
    level.entities.add(timer);

    level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
        level.music.playTheme();
    });
    level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
        level.music.playHurryTheme();
    });
}

function setupBackgrounds(levelSpec, level, backgroundSprites, patterns){
    levelSpec.layers.forEach(layer => {
        //const backgroundGrid = createGrid(layer.tiles, levelSpec.patterns);
        const grid = createGrid(layer.tiles, patterns);
        const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
        level.comp.layers.push(backgroundLayer);
        //level.tileCollider.addGrid(collisionGrid);
        level.tileCollider.addGrid(grid);
    });
}

function setupEntities(levelSpec, level, entityFactory) {
    //console.log("Build Entities {JS-JSON}:", levelSpec.entities, entityFactory);

    levelSpec.entities.forEach(({name, pos: [x, y]}) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.pos.set(x, y);
        level.entities.add(entity);
        //console.log(createEntity);
        //console.log("Entity {JS-JSON}:", name, "X:", x, "Y:", y);
    })

    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}

function setupTriggers(levelSpec, level) {
    if (!levelSpec.triggers) {
        return;
    }

    for (const triggerSpec of levelSpec.triggers) {
        const trigger = new Trigger();

        trigger.conditions.push((entity, touches, gc, level) => {
            level.events.emit(Level.EVENT_TRIGGER, triggerSpec, entity, touches);
        });

        const entity = new Entity();
        entity.addTrait(trigger);
        entity.size.set(64, 64);
        entity.pos.set(triggerSpec.pos[0], triggerSpec.pos[1]);
        level.entities.add(entity);
    }
}

export async function createLevelLoader(entityFactory) {
    return async function loadLevel(name) {
        //console.log('Loading Level {JSON}:', name, "from file directory: \"levels\"");
        const levelSpec = await loadJSON(`levels/${name}.json`);
        const [levelSpec_1, backgroundSprites, musicPlayer, patterns] = await Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet),
            loadMusicSheet(levelSpec.musicSheet),
            loadPattern(levelSpec.patternSheet),
        ]);
        const level = new Level();
        level.name = name;
        level.music.setPlayer(musicPlayer);
        
        //setupCollision(levelSpec, level);
        setupBackgrounds(levelSpec_1, level, backgroundSprites, patterns);
        setupEntities(levelSpec_1, level, entityFactory);
        setupTriggers(levelSpec_1, level);
        setupBehavior(level);

        return level;
    }
};

function createGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, tile);
    }

    return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield {x, y};
        }
    }
}
function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);

    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges){
    for (const range of ranges){
        yield* expandRange(range);
    }
}

function* expandTiles(tiles, patterns) {
    function* walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const dervivedX = x + offsetX;
                const dervivedY = y + offsetY;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, dervivedX, dervivedY);
                } else {
                    yield {
                        tile,
                        x: dervivedX,
                        y: dervivedY,
                    };
                }   
            }    
        }
    }

    yield* walkTiles(tiles, 0, 0);
}