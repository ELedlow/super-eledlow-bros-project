//---- Clock (not Timer Clock)
/**
 * Intended to start a global clock to help in coding
 * @deprecated
 * This is a very very old version of `new Timer()`
 */
export function startClock(startT) {
    var GlobalClock = startT;
    console.log(`⏱️Timer⏱️ started at: ${startT}`);
    setInterval(() => {
        GlobalClock += 0.01;
    }, 10);
    return GlobalClock;
}
export var clock = startClock(0)
