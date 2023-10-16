import { Entity } from "../Entity.js";
import { Trait } from "../Trait.js";
import { Killable } from "../traits/Killable.js";
import { Physics } from "../traits/Physics.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import { canvas } from "../main.js";

export async function loadBrick() { 
    const sprite = await loadSpriteSheet('brick');
    return createBrickFactory(sprite);
}

class Behavior extends Trait {
    collides(_us, _them) {
        
    }

    update(us) {
        if(us.pos.x > canvas.height) {
            us.traits.get(Killable).kill();
        }
    }
}

function createBrickFactory(sprite) {
    //const brokenAnim = sprite.animation.get('break');

    function routeAnim(brick) {
        return 'broke';
        //return brokenAnim(brick.lifetime);
    }

    function drawBrick(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    };

    return function createBrick() {
        const brick = new Entity();
        brick.size.set(16, 16);
        //brick.offset.set(32, 32);
        brick.addTrait(new Physics());
        brick.addTrait(new Behavior());
        brick.addTrait(new Killable());
        brick.traits.get(Killable).removeAfter = 4
        brick.traits.get(Behavior).update(brick);

        brick.draw = drawBrick;

        return brick;
    };
}