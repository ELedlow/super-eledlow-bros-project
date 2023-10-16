/**
 * Draws a black square on top of the canvas using the context. Is good for placeholders in many situaltions.
 * @deprecated
 * Can be replaced by a more advanced draw function
 * @broken
 * Only draws with the current frame rate
 */ 
function buildrect(x, y, x2, y2, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, x2, y2);
    ctx.fillStyle = color;
    ctx.clearCanvas;
}
export {buildrect}