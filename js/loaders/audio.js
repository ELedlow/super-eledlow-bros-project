import { loadJSON } from "../loaders.js";
import { AudioBoard } from "../AudioBoard.js";

export async function loadAudioBoard(name, audioContext) {
    const loadAudio = createAudioLoader(audioContext);
    const audioSheet = await loadJSON(`./sounds/${name}.json`);
    const audioBoard = new AudioBoard(audioContext);
    const fx = audioSheet.fx;
    const jobs = [];
    Object.keys(fx).forEach(name_1 => {
        const url_2 = fx[name_1].url;
        const job = loadAudio(url_2).then(buffer => {
            audioBoard.addAudio(name_1, buffer);
        });
        jobs.push(job);
    });
    await Promise.all(jobs);
    return audioBoard;
}

export function createAudioLoader(context) {
    return async function loadAudio(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return context.decodeAudioData(arrayBuffer);
    };
}