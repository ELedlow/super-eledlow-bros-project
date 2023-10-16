export class InputRouter {
    constructor() {
        this.receivers = new Set();
    }

    addReciver(receiver) {
        this.receivers.add(receiver);
    }

    dropReciver(receiver) {
        this.receivers.delete(receiver);
    }

    route(routeInput) {
        for (const receiver of this.receivers) {
            routeInput(receiver)
        }
    }
}

export default {InputRouter}