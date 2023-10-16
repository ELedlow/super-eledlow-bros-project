import { Camera } from "./Camera.js";
import { Compositor } from "./Compositor.js";
import { EventEmitter } from "./EventEmitter.js";
import { MusicController } from "./MusicController.js";
import { EntityCollider } from "./EntityCollider.js";
import { Scene } from "./Scene.js";
import { TileCollider } from "./TileCollider.js";
import { findPlayers } from "./player.js";

function focusPlayer(level) {
    for (const player of findPlayers(level.entities)) {
        level.camera.pos.x = Math.max(0, player.pos.x - 140);
    }
}

export class Level extends Scene{
    static EVENT_TRIGGER = Symbol('trigger');
    constructor() {
        super();

        this.name = "";

        this.gravity = 1500;
        this.totalTime = 0;

        this.camera = new Camera();window.camera = this.camera;

        this.music = new MusicController();

        this.entities = new Set();
        //this.tiles = new Matrix();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = new TileCollider();
        //this.tileCollider = null  
        //...new TileCollider(this.tiles);
    }

    draw(gameContext) {
        this.comp.draw(gameContext.videoContext, this.camera);
    }

    /*setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }*/

    update(gameContext) {
        this.entities.forEach(entity => {
            entity.update(gameContext, this);

            //entity.pos.x += entity.vel.x * deltaTime;
            //this.tileCollider.checkX(entity);

            //entity.pos.y += entity.vel.y * deltaTime;
            //this.tileCollider.checkY(entity);

            //entity.vel.y += this.gravity * deltaTime;
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });
        this.entities.forEach(entity => {
                if (entity.finalize === undefined || entity.finalize === null) {
                    //some entities are annoying like this
                    console.error("entity missing property finalize.");
                    console.log("debugging: find this entity:", entity);
                }else{
                    entity.finalize();
                }
                
        });
        
        focusPlayer(this);

        this.totalTime += gameContext.deltaTime;
    }

    pause() {
        this.music.pause();
    }
}

//---- as default
export default {Level}