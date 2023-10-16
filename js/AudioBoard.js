export class AudioBoard {
    constructor() {
        //this.context = context;
        this.buffers = new Map();
    }

    addAudio(name, buffers) {
        this.buffers.set(name, buffers);
    }

    playAudio(name, audioContext) {
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);
        source.buffer = this.buffers.get(name);
        source.start(0);
    }
}

export default {AudioBoard}