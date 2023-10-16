import { Entity } from "../Entity.js";
import { Trait } from "../Trait.js";
import { PendulumMove } from "../traits/PendulumMove.js";
import { Killable } from "../traits/Killable.js";
import { Physics } from "../traits/Physics.js";
import { Solid } from "../traits/Solid.js";
import { Stomper } from "../traits/Stomper.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

export async function loadGoomba() { 
    const sprite = await loadSpriteSheet('goomba');
    return createGoombaFactory(sprite);
}

class Behavior extends Trait {
    collides(us, them) {
        if (us.traits.get(Killable).dead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y && us.traits.get(Killable).dead === false) {
                us.traits.get(Killable).kill();
                them.traits.get(Stomper).collides(us, them);
                //them.stomper.bounce();
                us.traits.get(PendulumMove).speed = 0;
            } else {
                them.traits.get(Killable).kill();
            } 
        }

        if (them.traits.has(PendulumMove)) {
            if (them.vel.y >= us.vel.y && us.traits.get(Killable).dead === false && them.mentalState === "STATE_PANIC") {
                us.traits.get(Killable).kill();
                us.traits.get(PendulumMove).speed = 0;
                us.vel.set(100, -200);
                us.traits.get(Solid).obstructs = false;
            }
        }
    }
}

function createGoombaFactory(sprite) {
    //console.log("Goomba {JS/JSON}:", sprite);
    const walkAnim = sprite.animation.get('walk');

    function routeAnim(goomba) {
                //this will make it to where the goomba has to wait for mario
        if (window.camera.pos.x > (goomba.pos.x - 350) && window.camera.pos.x < (goomba.pos.x + 350)){
            goomba.traits.get(PendulumMove).enabled = true;
        }else{
            goomba.traits.get(PendulumMove).enabled = false;
        }
        if (goomba.traits.get(Killable).dead) {
            return 'flat';
        }        

        return walkAnim(goomba.lifetime);
    }

    function drawGoomba(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    };

    return function createGoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);
        //goomba.vel.x = -30;
        goomba.addTrait(new Physics());
        goomba.addTrait(new Solid());
        goomba.addTrait(new PendulumMove());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());
        goomba.traits.get(PendulumMove).enabled = false;
        goomba.traits.get(Behavior).update(goomba);

        goomba.draw = drawGoomba;

        return goomba;
    };
}