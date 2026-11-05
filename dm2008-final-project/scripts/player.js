class Player {
    constructor() {
        this.position = createVector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.speed = 5;
        this.sizeWidth = 55;
        this.sizeHeight = 67.5;

        // Light variables.
        this.lanternState = "off";
        this.lightMinDiameter = 100;
        this.lightMaxDiameter = 275;
        this.lightDiameter = this.lightMinDiameter;
        this.litSpeed = 0.10;
        this.dimSpeed = 1;
    }
    update() {
        this.show();
    }
    show() {
        push();
        imageMode(CENTER);
        image(imgPlayer, this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);
        pop();
    }
    handleMovement(inputVector) {
        // The directional inputVector is changed into a magnitude of 1 and then multiplied by the speed.
        inputVector.normalize();
        this.position.add(inputVector.setMag(this.speed));

        // This constrains the position so it never goes beyond bounds.
        this.position.x = constrain(this.position.x, this.sizeWidth / 2, WORLD_WIDTH - this.sizeWidth / 2);
        this.position.y = constrain(this.position.y, this.sizeHeight / 2, WORLD_HEIGHT - this.sizeHeight / 2);
    }
    drawLight(layer) {
        this.changeLightSize();
        layer.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    changeLightSize() {
        // The lightDiameter linearly interpolates to the lightMaxDiameter based on the litSpeed.
        if (this.lanternState == "lit") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);

            // Round is necessary because lerp tends to never reach a point.
            if (round(this.lightDiameter) == this.lightMaxDiameter) {
                this.lightDiameter = this.lightMaxDiameter;
                this.lanternState = "dim";
            }
        }
        // Then it reduces in size linearly based on dimSpeed until it is lightMinDiameter.
        else if (this.lanternState == "dim") {
            this.lightDiameter -= this.dimSpeed;

            if (this.lightDiameter <= this.lightMinDiameter) {
                this.lightDiameter = this.lightMinDiameter;
                this.lanternState = "off";
            }
        }
    }
    checkCollision(interaction, collisionSize) {
        let collisionRadius = collisionSize / 2;

        if (dist(this.position.x, this.position.y, interaction.position.x, interaction.position.y) <= collisionRadius) {
            interaction.interact();
        }
    }
}