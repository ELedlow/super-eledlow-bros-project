import { Entity } from "../Entity.js";
import { Go } from "../traits/Go.js";
import { Jump } from "../traits/Jump.js";
import { Killable } from "../traits/Killable.js";
import { Physics } from "../traits/Physics.js";
import { Solid } from "../traits/Solid.js";
import { Stomper } from "../traits/Stomper.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import { AudioBoard } from "../AudioBoard.js";
//import { Clone } from "../traits/clone.js";
//import { createAnim } from "../anim.js";
//import { Velocity } from "../../private/Velocity.js";

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export async function loadMario(audioContext) {
    /* 
    loadAudioBoard('mario', audioContext)
    .then(audioBoard => {
        console.log(audioBoard);
    });
    const sprite = await loadSpriteSheet('mario');
    return createMarioFactory(sprite);
    */

    return Promise.all([
        loadSpriteSheet('mario'),
        loadAudioBoard('mario', audioContext),
    ])
    .then(([sprite, audio]) => {
        return createMarioFactory(sprite, audio);
    })
}
//createAnim(['run-1', 'run-2', 'run-3'], 8);

function createMarioFactory(sprite, audio) {
    //console.log('AudioBoard in factory', audio);
    //console.log("Mario {JS/JSON}:", sprite);

    const runAnim = sprite.animation.get('run');

    function routeFrame(mario_1) {
        if (mario_1.traits.get(Jump).falling) {
            return 'jump';
        }

        if (mario_1.traits.get(Go).distance > 0) {
            if ((mario_1.vel.x > 0 && mario_1.traits.get(Go).dir < 0) || (mario_1.vel.x < 0 && mario_1.traits.get(Go).dir > 0)) {
                return 'break';
            }

            return runAnim(mario_1.traits.get(Go).distance);
        }

        return 'idle';
    }

    function setTurboState(turboOn) {
        this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    };

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0);
    };

    return function createMario() {
        const mario = new Entity();
        mario.audio = audio;
        mario.size.set(14, 16);
        //mario.offset.set(0, 0);
        mario.addTrait(new Physics());
        mario.addTrait(new Solid());
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Stomper());
        mario.addTrait(new Killable());
        //mario.addTrait(new Clone());

        mario.traits.get(Killable).removeAfter = 0;
        //mario.addTrait(new Velocity());
        mario.turbo = setTurboState;
        mario.draw = drawMario;
        //mario.bounds = new BoundingBox(mario.pos, mario.size, mario.offset);

        mario.turbo(false);
        
        return mario;
    };
}
//