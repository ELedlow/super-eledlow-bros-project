export class marioAI {
    constructor(entity) {
        this.R = Math.random();
        if (this.R > 0 && this.R < 0.05) {
            this.name = "Jim";
        } else if (this.R > 0.05 && this.R < 0.1) {
            this.name = undefined;
        } else if (this.R > 0.15 && this.R < 0.2) {
            this.name = "Joe";
        } else if (this.R > 0.25 && this.R < 0.3) {
            this.name = "Mario";
        } else if (this.R > 0.35 && this.R < 0.4) {
            this.name = "Mario";
        } else if (this.R > 0.45 && this.R < 0.5) {
            this.name = window;
        } else if (this.R > 0.55 && this.R < 0.6) {
            this.name = "yeety";
        } else if (this.R > 0.65 && this.R < 0.7) {
            this.name = "A.I.";
        } else if (this.R > 0.75 && this.R < 0.8) {
            this.name = "Gloveless";
        } else if (this.R > 0.85 && this.R < 0.9) {
            this.name = "Sam";
        } else {
            this.name = null;
        }
        console.log("Say hello to", this.name, "A.I.");
        setInterval(() => {
            var chance = Math.random();
            var chance2 = chance + Math.random();
            return this.chance = chance, this.chance2 = chance2;
        }, 500);
        setTimeout(() => { null; }, 1000);
        this.chance = Math.random();
        this.chance2 = Math.random();
        setInterval(() => {
            entity.dir = 1;
            entity.vel.x += 3 + this.chance - this.chance2;
            if (this.chance > 0.9) {
                entity.jump.start();
            }
        }, 0);
    }
}
