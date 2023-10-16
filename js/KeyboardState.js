const PRESSED = 1;
const REALEASED = 0;

export class KeyboardState {
    constructor(){
        // holds the current state of a given key
        this.keyStates = new Map();

        // holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(code, callback){
        this.keyMap.set(code, callback);
    }

    handleEvent(event) {
        const {code} = event;

        if (!this.keyMap.has(code)) {
            // did not have key mapped.
            return;
        }

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : REALEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);

        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                    this.handleEvent(event);
            });
        });
    }
}

//---- Original but unsed
export class KeyCode_KeyboardState {
    constructor(){
        // holds the current state of a given key
        this.keyStates = new Map();

        // holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(keyCode, callback){
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event) {
        const {keyCode} = event;

        if (!this.keyMap.has(keyCode)) {
            // did not have key mapped.
            return;
        }

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : REALEASED;

        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }

        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);

        this.keyMap.get(keyCode)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                    this.handleEvent(event);
            });
        });
    }
}


//---- as default
export default { KeyboardState, KeyCode_KeyboardState }

//---- if not on chrome
var Keyboard = KeyboardState;
export {Keyboard}