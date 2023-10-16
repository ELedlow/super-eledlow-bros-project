"use strict";//DO NOT DELETE THIS SCRIPT
import { Font } from "../loaders/font.js";//this allows you to change the font anytime.
import { loadImage } from "../loaders.js";//loads the font images. (the text)
import { SpriteSheet } from "../SpriteSheet.js";//it's a spritesheet like everything else is.

//this variable is the text in the font. don't change the ''
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789-×!@';

//heres what changes it:
/**
 * This is your decription of the function.
 * It is async to allow the 'await' rather than the 'return'
 * @custom_script
 * Used to change the font to any specified font, not a fixed font 
 */ 
export async function changeYerFont(font = "./img/SMB1/Fonts/Pixel/Black.png"){
    //up there where it says 'font = ' is pretty much just saying 
    //that the default font is "./img/SMB1/Fonts/Pixel/Black.png"
    //but it can be changed with any font input that is valid.

    //then it gets the image
    const image = await loadImage(font);

    //makes it into a sheet
    const fontSprite = new SpriteSheet(image);

    //size of the font
    const size = 8;

    //then the row length of each letter
    const rowlen = image.width;

    //then it reads the letter
    for (let [index, char] of [...CHARS].entries()) {
        //positions x (left to right)
        const x = index * size % rowlen;

        //positions y (up to down)
        const y = Math.floor(index * size / rowlen) * size;

        //then it defines it so it can return a font
        fontSprite.define(char, x, y + 2, size, size);
    }

    //now it actually makes the font
    return new Font(fontSprite, size);
}

//how to use is by going into js/main.js and change the
//'loadFont()' script to 'changeYerFont('with your font as the string')'