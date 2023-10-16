import { TileResolver } from '../TileResolver.js';

export function createBackgroundLayer(level, tiles, sprites) {
    const resolver = new TileResolver(tiles);

    const buffer = document.createElement('canvas');
    buffer.width = 9999;
    buffer.height = 9999;

    const context = buffer.getContext('2d');

    function redraw(startIndex, endIndex) {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = startIndex; x <= endIndex; ++x) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tiles, y) => {
                    if (sprites.animation.has(tiles.name)) {
                        sprites.drawAnim(tiles.name, context, x - startIndex, y, level.totalTime);
                    } else {
                        sprites.drawTile(tiles.name, context, x - startIndex, y);
                    }
                });
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        context.drawImage(buffer,
            Math.floor(-camera.pos.x % 16),
            Math.floor(-camera.pos.y)
        );
    };
}
