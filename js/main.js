//'use strict';
// video: 25/25 55:30/57:52
//---- Imports

//---- game main:
import { Level } from './Level.js';
import { Timer } from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadFont } from './loaders/font.js';
import { loadEntities } from './entities.js';
import { makePlayer, createPlayerEnv, findPlayers } from './player.js';
import { setupKeyboard } from './input.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createColorLayer } from './layers/color.js';
import { createTextLayer } from './layers/text.js';
import { EventEmitter } from './EventEmitter.js';
import { SceneRunner } from './SceneRunner.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import { Scene } from './Scene.js';
import { TimedScene } from './TimedScene.js';
import { LevelTimer } from './traits/LevelTimer.js';
import { Killable } from './traits/Killable.js';

//---- debug:
import { createCameraLayer } from "./layers/camera.js";
import { createCollisionLayer } from "./layers/collision.js";
import { setupMouseControl } from './debug.js';

//---- main-only:
//import { marioAI } from './marioAI.js';
//import { elementFromHtml } from './element.js';
import { startClock } from  './clock.js';
import { buildrect } from './buildrect.js';


//---- help me
window.EventEmitter = new EventEmitter();

//---- this is where you can put your mod
//import { changeYerFont } from './mods/fontmod.js';

//---- main
async function main(canvas, context) {
    const videoContext = context;
    //startClock(0.00);
    //const context = canvas.getContext('2d');
    const audioContext = new AudioContext();
    //this is where you can put:
    //changeYerFont("./img/SMB1/Fonts/Pixel/Black.png"),
    //inside of the promise:
    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario();
    makePlayer(mario, 'Mario')
    window.mario = mario;
    //---- movement
    const inputRouter = setupKeyboard(window);
    inputRouter.addReciver(mario);

    async function runLevel(name) {
        console.log('Loading', name);
           
        const loadScreen = new Scene();
        loadScreen.comp.layers.push(createColorLayer('#000'));
        loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}. Please wait...`));
        sceneRunner.addScene(loadScreen);
        sceneRunner.runNext();

        //await new Promise(resolve => setTimeout(resolve, 1000));

        const level = await loadLevel(name);

        level.events.listen(Level.EVENT_TRIGGER, (spec, _trigger, touches) => {
            if (spec.type === "goto") {
                for (const _entity of findPlayers(touches)) {
                    runLevel(spec.name);
                    return;
                }
            }
        });

        listenForTimeDeath(level)

        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, level);
        /* //ELedlow
        const eledlow = createPlayer(entityFactory.eledlow());
        eledlow.player.name = "ELedlow"
        level.entities.add(eledlow);
        */
        mario.pos.set(0,0);
        level.entities.add(mario);

        window.mario = mario;
        /*
        setInterval(() => {
            console.log("x pos:",window.mario.pos.x, "y pos:",window.mario.pos.y);
        }, 0);*/
        //console.log('Player entity:',mario);
        
        const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);
    
        const waitScreen = new TimedScene();
        waitScreen.countDown = 0;
        waitScreen.comp.layers.push(createColorLayer('#000'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);
        sceneRunner.addScene(waitScreen);

        //--- Debug
        //setupMouseControl(canvas, mario, camera);
        //level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera));

        //--- dashboard
        level.comp.layers.push(dashboardLayer);
        sceneRunner.addScene(level);

        sceneRunner.runNext();
    }

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    }

    timer.start();

    runLevel('1-1');
    window.runLevel = runLevel;
    
    buildrect(0, 0, canvas.width, canvas.height, 'black', context);
}
export const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

startClock(0.00);

export function loadTheErrorOntoThePage(loadError){
    document.body.appendChild(loadError);
}

//const start = () => {
    //window.removeEventListener('click', start);
    main(canvas, context);
//};

//window.addEventListener('click', start);

function listenForTimeDeath(level) {
    level.events.listen(LevelTimer.EVENT_TIMER_DEATH, () => {
        for (const entity of findPlayers(level.entities)) {
            if (entity.traits.has(Killable)){
                entity.traits.get(Killable).kill();
            }  
        }
    });
}
