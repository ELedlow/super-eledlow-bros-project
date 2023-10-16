import { loadImage } from "../loaders.js";
import { SpriteSheet } from "../SpriteSheet.js";

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789-×!@.';
//update! fixed blue-screen background and '!' height
const UNHANDLEDCHARS = '\"\'abcdefghijklmnopqrstuvwxyz <>()[]{}|\\_=+~`#$%^&*/?,¿º×¼½¾§¦';
//@ is a coin btw

console.log("Handled Chars:",CHARS);
console.warn("Missing Chars due to stupid limitations:", UNHANDLEDCHARS, "but \"º¼½¾§¦\" isn't supported on a normal NES anyway")
export class Font {
    constructor(sprites, size) {
        this.sprites = sprites;
        this.size = size;
    }

    print(text, context, x, y) {
        [...text].forEach((char, pos) => {
            this.sprites.draw(char, context, x + pos * this.size, y);
        })
    }
}

export async function loadFont(){
    const image = await loadImage("./img/SMB1/Fonts/Pixel/White.png");
    const fontSprite = new SpriteSheet(image);
    const size = 8;
    const rowlen = image.width;
    for (let [index, char] of [...CHARS].entries()) {
        const x = index * size % rowlen;
        const y = Math.floor(index * size / rowlen) * size;
        fontSprite.define(char, x, y + 2, size, size);
    }
    return new Font(fontSprite, size);
}