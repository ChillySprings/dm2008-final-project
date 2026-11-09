class Lamp {
    constructor(position) {
        this.position = position;
        this.sizeWidth = 10;
        this.sizeHeight = 10;

        // Collision variables
        this.collisionWidth = 10;
        this.collisionHeight = 10;

        // Light variables
        this.state = "flicker";
        this.litSpeed = 0.1;
        this.dimSpeed = 1;
        this.lightMaxDiameter = 200;
        this.lightMinDiameter = 100;
        this.lightDiameter = this.lightMinDiameter;
        this.baseLightDiameter = this.lightDiameter;
        this.noiseOffset = random(1000);
        this.flickerStrength = 1;
    }
    update() {
        this.flicker();
        this.changeLightSize();
    }
    show() {
        push();
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);

        //Comment this if you don't want to check collisionSize.
        noFill();
        stroke();
        rectMode(CENTER);
        rect(this.position.x, this.position.y + this.sizeHeight / 2, this.collisionWidth, this.collisionHeight);

        pop();
    }
    drawLight(layer) {
        layer.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    interact() {
        this.state = "lit";
    }
    changeLightSize() {
        // The lightDiameter linearly interpolates to the lightMaxDiameter based on the litSpeed.
        if (this.state == "lit") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);

            // Round is necessary because lerp tends to never reach a point.
            if (round(this.lightDiameter) == this.lightMaxDiameter) {
                this.lightDiameter = this.lightMaxDiameter;
                this.state = "dim";
            }
        }
        // Then it reduces in size linearly based on dimSpeed until it is lightMinDiameter.
        else if (this.state == "dim") {
            this.lightDiameter -= this.dimSpeed;

            if (this.lightDiameter <= this.lightMinDiameter) {
                this.lightDiameter = this.lightMinDiameter;
                this.state = "flicker";
                this.flickerStrength = 0;
            }
        }
    }
    flicker() {
        if (this.state != "flicker") {
            return;
        }

        // Change this to change how smooth the transition to flickering should be; 1 is sharpest.
        let flickerStrengthSpeed = 0.1;
        this.flickerStrength = lerp(this.flickerStrength, 1, flickerStrengthSpeed);

        // Change this to change how quickly the light flickers.
        let flickerSpeed = 0.01;
        let flickerNoise = noise(frameCount * flickerSpeed + this.noiseOffset);

        // Change these to change by how much the light can flicker by.
        let minChange = -20;
        let maxChange = 30;

        let flicker = map(flickerNoise, 0, 1, minChange, maxChange);

        this.lightDiameter = this.lightMinDiameter + flicker * this.flickerStrength;
    }
    getYPivot() {
        return this.position.y + this.sizeHeight / 2;
    }
}