import { loadJSON, loadImage } from '../loaders.js';
import { SpriteSheet } from '../SpriteSheet.js';
import { createAnim } from "../anim.js";

export async function loadSpriteSheet(name) {
    const sheetSpec = await loadJSON(`sprites/${name}.json`);
    const [sheetSpec_1, image] = await Promise.all([
        sheetSpec,
        loadImage(sheetSpec.imageURL),
    ]);
    const sprites = new SpriteSheet(
        image,
        sheetSpec_1.tileW,
        sheetSpec_1.tileH);
        //console.log('Image <img/html>:', image);
    if (sheetSpec_1.tiles){
        sheetSpec_1.tiles.forEach(tileSpec => {
            sprites.defineTile(
                tileSpec.name,
                tileSpec.index[0],
                tileSpec.index[1]);
        });
    }

    if (sheetSpec_1.frames){
        sheetSpec_1.frames.forEach(frameSpec => {
            sprites.define(frameSpec.name, ...frameSpec.rect);
        });
    }
    
    if (sheetSpec_1.animations){
        sheetSpec_1.animations.forEach(animSpec => {
            const animation = createAnim(animSpec.frames, animSpec.frameLen);
            sprites.defineAnim(animSpec.name, animation);
        });
    }
    
    return sprites;
}