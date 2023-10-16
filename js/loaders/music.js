import { loadJSON } from "../loaders.js";
import { MusicPlayer } from "../MusicPlayer.js";

export async function loadMusicSheet(name) {
    const musicSheet = await loadJSON(`./music/${name}.json`);
    const musicPlayer = new MusicPlayer();
    for (const [name_1, track] of Object.entries(musicSheet)) {
        musicPlayer.addTrack(name_1, track.url);
    }
    return musicPlayer;
}
/*
export function loadMusicSheet(name) {
    return loadJSON(`./music/${name}.json`)
        .then(musicSheet => {
            const musicPlayer = new MusicPlayer();
            for (const [name, track] of Object.entries(musicSheet)) {
                musicPlayer.addTrack(name, track.url);
            }
            return musicPlayer;
        });
}
*/