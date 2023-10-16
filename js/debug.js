export function setupMouseControl(canvas, entity, camera){
    let lastEvent;

    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                entity.vel.set(0,0);
                entity.pos.set(
                    (event.offsetX + (camera.pos.x * 2))/2,
                    (event.offsetY + (camera.pos.y * 2))/2);
            } else if (event.buttons === 2
                && lastEvent && lastEvent.buttons === 2
                && lastEvent.type === 'mousemove') {
                camera.pos.x -= event.offsetX - lastEvent.offsetX;
                camera.pos.y -= event.offsetY - lastEvent.offsetY;
            }
            lastEvent = event;
        });
    }); 

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
}