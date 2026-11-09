class Flower {
    constructor(position) {
        this.position = position;
        this.sizeWidth = 30;
        this.sizeHeight = 25;

        // Light variables.
        this.lightDiameter = 0;
        this.lightMaxDiameter = 85;
        this.litSpeed = 0.25;
        this.dimSpeed = 0.25;

        // Interaction variables.
        this.state = "normal";
        this.timerDuration = 2000;
        this.startTime;
        this.interactedFlowers = new Set();
    }
    update() {
        this.timer();
    }
    show() {
        push();
        imageMode(CENTER);

        let img;
        if (this.state == "normal") {
            img = imgFlowerClose;
        } else {
            img = imgFlowerOpen;
        }

        image(img, this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);
        pop();
    }
    interact() {
        this.state = "interacted";
    }
    drawLight(mask) {
        this.changeLightSize();
        mask.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    changeLightSize() {
        // The lightDiameter linearly interpolates to the lightMaxDiameter based on the litSpeed.
        if (this.state != "normal") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);
        }
        else {
            // The lightDiameter linearly interpolates to 0 based on the dimSpeed.
            this.lightDiameter = lerp(this.lightDiameter, 0, this.dimSpeed);

            // Round is necessary because lerp tends to never reach a point.
            if (round(this.lightDiameter) == 1) {
                this.lightDiameter = 0;
            }
        }
    }
    timer() {
        if (this.state == "interacted") {
            this.startTime = millis();
            this.state = "waiting";
        }
        else if (this.state == "waiting") {
            let elapsed = millis() - this.startTime;
            if (elapsed >= this.timerDuration) {
                this.state = "normal";
                this.interactedFlowers.clear();
            }
        }
    }
    checkCollision(flower) {
        // All flowers that have been interacted with by another flower are added into a Hashset (no duplicates).
        if (this.interactedFlowers.has(flower)) {
            // Returns so flowers that have been interacted with do not interact with each other.
            return;
        }

        let collisionRadius = this.lightDiameter / 2;

        if (dist(this.position.x, this.position.y, flower.position.x, flower.position.y) <= collisionRadius) {
            flower.interact();
            this.interactedFlowers.add(flower);
        }
    }
    getYPivot() {
        return this.position.y + this.sizeHeight / 2;
    }
}