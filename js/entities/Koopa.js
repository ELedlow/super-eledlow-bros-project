import { Entity } from "../Entity.js";
import { Trait } from "../Trait.js";
import { PendulumMove }from "../traits/PendulumMove.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import { Physics } from "../traits/Physics.js";
import { Solid } from "../traits/Solid.js";
import { Stomper } from "../traits/Stomper.js";
import { Killable } from "../traits/Killable.js";

export async function loadKoopa() { 
    const sprite = await loadSpriteSheet('koopa');
    return createKoopaFactory(sprite);
}

const STATE_WALKING = Symbol(`walking`);
const STATE_HIDING = Symbol(`hiding`);
const STATE_PANIC = Symbol(`panic`);

class Behavior extends Trait {
    constructor() {
        super();

        this.hideTime = 0;
        this.hideDuration = 5;

        this.walkSpeed = null;
        this.panicSpeed = 300;

        this.state = STATE_WALKING;
    }

    collides(us, them) {
        //setTimeout(() => {}, 1);
        if (us.traits.get(Killable).dead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y && us.traits.get(Killable).dead === false) {
                this.handleStomp(us, them);
                them.traits.get(Stomper).collides(us, them);
                //them.stomper.bounce(us, them);
            } else {
                this.handleNudge(us, them);
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

    handleNudge(us, them) {
        if (this.state === STATE_WALKING) {
            them.traits.get(Killable).kill();
        } else if (this.state === STATE_HIDING) {
            this.panic(us, them);
        } else if (this.state === STATE_PANIC) {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                them.traits.get(Killable).kill();
            }
        }
        
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.traits.get(Killable).kill();
            us.vel.set(100, -200);
            us.traits.get(Solid).obstructs = false;
            //us.canCollide = false;
        } else if (this.state === STATE_PANIC) {
            this.hide(us);
        }
    }

    hide(us) {
        us.vel.x = 0;
        us.traits.get(PendulumMove).enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.traits.get(PendulumMove).speed;
        }
        this.hideTime = 0;
        this.state = STATE_HIDING;
        us.mentalState = "STATE_HIDING";
    }

    unhide(us) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.walkSpeed;
        this.state = STATE_WALKING;
        us.mentalState = "STATE_WALKING";
    }

    panic(us, them) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATE_PANIC;
        us.mentalState = "STATE_PANIC";
    }

    update(us, gameContext) {
        const deltaTime = gameContext.deltaTime;
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}


function createKoopaFactory(sprite) {
    //console.log("Koopa {JS/JSON}:", sprite);
    const walkAnim = sprite.animation.get('walk');
    const wakeAnim = sprite.animation.get('wake');

    function routeAnim(koopa) {  
        //this will make it to where the koopa has to wait for mario
        if (koopa.traits.get(Behavior).state === STATE_WALKING) {
            if (window.camera.pos.x > (koopa.pos.x - 350) && window.camera.pos.x < (koopa.pos.x + 350)){
                koopa.traits.get(PendulumMove).enabled = true;
            }else{
                koopa.traits.get(PendulumMove).enabled = false;
            }
        }

        if (koopa.traits.get(Behavior).state === STATE_HIDING) {
            if (koopa.traits.get(Behavior).hideTime > 3) {
                return wakeAnim(koopa.traits.get(Behavior).hideTime);
            }
            return 'hiding';
        } 

        if (koopa.traits.get(Behavior).state === STATE_PANIC) {
            return 'hiding';
        }

        return walkAnim(koopa.lifetime);
    }

    function drawKoopa(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0);
    };

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;
        //koopa.vel.x = -30;
        koopa.addTrait(new Physics());
        koopa.addTrait(new Solid());
        koopa.addTrait(new PendulumMove());
        koopa.traits.get(PendulumMove).enabled = false;
        koopa.addTrait(new Behavior());
        koopa.addTrait(new Killable());
        koopa.mentalState = "STATE_WALKING";

        koopa.draw = drawKoopa;

        return koopa;
    };
}