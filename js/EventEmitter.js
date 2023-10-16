export class EventEmitter {
    constructor() {
        this.listeners = [];
    }

    listen(name, callback) {
        const listener = [];
        listener.name = name;
        listener.callback = callback;
        
        //console.log(listener)
        this.listeners.push(listener);
    }

    emit(name, ...args) {
        //better method
        this.listeners.forEach(listener => {
            if (listener.name === name) {
                listener.callback(...args)
            }
        });
    }
}

export default {EventEmitter}