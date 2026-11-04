class Player {
    constructor() {
        this.position = createVector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.speed = 5;
        this.size = 10;

        this.lanternState = "off";
        this.lightDiameter = 0;
        this.lightMaxDiameter = 200;
        this.litSpeed = 0.25;
        this.dimSpeed = 1;
    }
    update() {
        this.show();
        this.borders();
    }
    show() {
        push();
        rectMode(CENTER);
        square(this.position.x, this.position.y, this.size);
        pop();
    }
    handleMovement(inputVector) {
        inputVector.normalize();
        this.position.add(inputVector.setMag(this.speed));
    }
    drawLight(layer) {
        this.changeLightSize();
        layer.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    changeLightSize() {
        if (this.lanternState == "lit") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);

            if (round(this.lightDiameter) == this.lightMaxDiameter) {
                this.lightDiameter = this.lightMaxDiameter;
                this.lanternState = "dim";
            }
        }
        // Then it reduces in size until it is no more.
        else if (this.lanternState == "dim") {
            this.lightDiameter -= this.dimSpeed;

            if (this.lightDiameter <= 0) {
                this.lightDiameter = 0;
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
    borders() {
        this.position.x = constrain(this.position.x, this.size / 2, WORLD_WIDTH - this.size / 2);
        this.position.y = constrain(this.position.y, this.size / 2, WORLD_HEIGHT - this.size / 2);
    }
}