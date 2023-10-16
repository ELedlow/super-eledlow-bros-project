import { Entity } from "../Entity.js";
import { Emitter } from "../traits/Emitter.js";
import { findPlayers } from "../player.js";
import { loadAudioBoard } from "../loaders/audio.js";

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(audioContext) {
    const audio = await loadAudioBoard('cannon', audioContext);
    return createCannonFactory(audio);
}

function createCannonFactory(audio) {
    //console.log("Cannon {invisible JS/JSON}:", null, "Using Bullet {JS/JSON}: entityFactories");

    function emitBullet(cannon, gameContext, level) {
        let dir = 1;
        for (const player of findPlayers(level.entities)) {
            //console.log("mario sus",player);
            if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD
            && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
                return;
            }
            if (player.pos.x < cannon.pos.x){
                dir = -1;
            }
        }

        const bullet = gameContext.entityFactory.bullet();

        bullet.pos.copy(cannon.pos);   
        bullet.vel.set(80 * dir, 0);
        //better speed: bullet.vel.set(80,0);     

        
        //this will make it to where the bullet has to load in range
        if (window.camera.pos.x > (cannon.pos.x - 350) && window.camera.pos.x < (cannon.pos.x + 350)){
            cannon.sounds.add('shoot');
            level.entities.add(bullet);   
        }
    }

    return function createCannon() {
        const cannon = new Entity();
        cannon.audio = audio;
        
        const emitter = new Emitter();
        emitter.interval = 4;
        emitter.emitters.push(emitBullet);
        cannon.addTrait(emitter);
        return cannon;
    };
}
//