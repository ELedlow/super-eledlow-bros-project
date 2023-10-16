import { Keyboard } from './KeyboardState.js';
import { InputRouter } from './inputRouter.js';
import { Go } from './traits/Go.js';
import { Jump } from './traits/Jump.js';

export var KeyInput = ['Space', 'KeyZ', 'ArrowRight', 'ArrowLeft', 'KeyI', 'KeyD', 'KeyA', 'KeyP', 'KeyM', 'KeyC'];
export var SpawnAI = 0;
export function setupKeyboard(window){
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);

    input.addMapping(KeyInput[0], keyState => {
        if (keyState) {
            router.route(entity => entity.traits.get(Jump).start());
        } else {
            router.route(entity => entity.traits.get(Jump).cancel());
        }
    });

    input.addMapping(KeyInput[1], keyState => {
        router.route(entity => entity.turbo(keyState));
    });

    input.addMapping(KeyInput[2], keyState => {
        router.route(entity => entity.traits.get(Go).dir += keyState ? 1 : -1);
    });

    input.addMapping(KeyInput[3], keyState => {
        router.route(entity => entity.traits.get(Go).dir += -keyState ? -1 : 1);
    });

    input.addMapping(KeyInput[4], keyState => {
        SpawnAI = keyState;
    });

    input.addMapping(KeyInput[5], keyState => {
        router.route(entity => entity.traits.get(Go).dir += keyState ? 1 : -1);
    });

    input.addMapping(KeyInput[6], keyState => {
        router.route(entity => entity.traits.get(Go).dir += -keyState ? -1 : 1);
    });

    input.addMapping(KeyInput[7], keyState => {
        if (keyState) {
            router.route(entity => entity.traits.get(Jump).start());
        } else {
            router.route(entity => entity.traits.get(Jump).cancel());
        }
    });

    input.addMapping(KeyInput[8], keyState => {
        router.route(entity).turbo(keyState);
    });

    input.addMapping(KeyInput[9], keyState => {
        console.log(keyState)
        if (keyState === 0) {
            if (window.crtOn){
                window.crtOn = false;
            }else{
                window.crtOn = true;
            }
        }
        
    });

    return router;
}