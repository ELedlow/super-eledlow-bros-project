import { Vec2 } from "./math.js"
import { canvas } from "./main.js";

export class Camera{
    constructor(){
        this.pos = new Vec2(0, 0);
        this.size = new Vec2(canvas.width, canvas.height)
    }
}

export default { Camera }