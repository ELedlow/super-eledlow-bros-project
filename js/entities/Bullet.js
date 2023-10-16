import { Entity } from "../Entity.js";
import { Trait } from "../Trait.js";
import { Killable } from "../traits/Killable.js";
import { Gravity } from "../traits/Gravity.js";
import { Stomper } from "../traits/Stomper.js";
import { Velocity } from "../traits/Velocity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

export async function loadBullet() { 
    const sprite = await loadSpriteSheet('bullet');
    return createBulletFactory(sprite);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.gravity = new Gravity();
    }

    collides(us, them) {
        if (us.traits.get(Killable).dead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y && us.traits.get(Killable).dead === false) {
                us.traits.get(Killable).kill();
                us.vel.set(100, -200);
                them.traits.get(Stomper).collides(us, them);
                //them.stomper.bounce();
                //us.pendulumMove.speed = 0;
            } else {
                them.traits.get(Killable).kill();
            }
        }
    }

    update(entity, gameContext, level) {
        if (entity.traits.get(Killable).dead) {
            this.gravity.update(entity, gameContext, level);
        }
    }
}

function createBulletFactory(sprite) {
    //console.log("Bullet {JS/JSON}:", sprite);
    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0, this.vel.x < 0);
    };

    return function createBullet() {
        const bullet = new Entity();
        bullet.size.set(16, 14);
        //bullet.vel.set(80,0);
        //better speed: bullet.vel.set(80,0);
        bullet.addTrait(new Velocity());
        bullet.addTrait(new Behavior());
        bullet.addTrait(new Killable());

        bullet.draw = drawBullet;

        return bullet;
    };
}