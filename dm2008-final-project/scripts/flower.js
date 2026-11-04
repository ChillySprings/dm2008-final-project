class Flower {
    constructor(position) {
        this.position = position;
        this.size = 10;
        this.colour = 0;

        this.lightDiameter = 0;
        this.lightMaxDiameter = 65;
        this.litSpeed = 0.25;
        this.dimSpeed = 0.25;

        this.state = "normal";
        this.timerDuration = 2000;
        this.startTime;
        this.interactedFlowers = new Set();
    }
    update() {
        this.show();
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
        image(img, this.position.x, this.position.y, 30, 25);
        pop();
    }
    interact() {
        this.state = "interacted";
    }
    flowerInteract() {
        if (this.state == "normal") {
            this.state = "interacted";
        }
    }
    drawLight(mask) {
        this.changeLightSize();
        mask.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    changeLightSize() {
        if (this.state != "normal") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);
        }
        else {
            this.lightDiameter = lerp(this.lightDiameter, 0, this.dimSpeed);

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
        if (this.interactedFlowers.has(flower)) {
            return;
        }

        let collisionRadius = this.lightDiameter / 2;

        if (dist(this.position.x, this.position.y, flower.position.x, flower.position.y) <= collisionRadius) {
            flower.interact();
            this.interactedFlowers.add(flower);
        }
    }
}