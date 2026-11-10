class Player {
    constructor() {
        this.position = createVector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.speed = 5;
        this.sizeWidth = 55;
        this.sizeHeight = 67.5;

        // Collision variables.
        this.collisionWidth = 55;
        this.collisionHeight = 20;

        // Light variables.
        this.lanternState = "flicker";
        this.lightMinDiameter = 75;
        this.lightMaxDiameter = 275;
        this.lightDiameter = this.lightMinDiameter;
        this.litSpeed = 0.1;
        this.dimSpeed = 1;
        this.flickerStrength = 1;
        this.noiseOffset = random(1000);

        // in the constructor
        this.footstepInterval = 350;
        this.footstepTimer = 0;
        this.isWalking = false;
    }
    update() {
        this.flicker();
        this.changeLightSize();
    }
    show() {
        push();
        imageMode(CENTER);
        image(imgPlayer, this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);

        //Comment this if you don't want to check collisionSize.
        // noFill();
        // stroke();
        // rectMode(CENTER);
        // rect(this.position.x, this.position.y + this.sizeHeight / 2, this.collisionWidth, this.collisionHeight);

        pop();
    }
    handleMovement(inputVector, obstacles) {
        if (inputVector.mag() === 0) {
            return false;
        }
        
        // The directional inputVector is changed into a magnitude of 1 and then multiplied by the speed.
        inputVector.normalize();
        inputVector.setMag(this.speed);

        // This checks against collisions with any obstacle.
        let nextPosition = p5.Vector.add(this.position, inputVector);
        for (let obstacle of obstacles) {
            if (this.checkCollision(nextPosition, obstacle)) {
                return false;
            }
        }
        this.position = nextPosition;

        // This constrains the position so it never goes beyond bounds.
        this.position.x = constrain(this.position.x, this.sizeWidth / 2, WORLD_WIDTH - this.sizeWidth / 2);
        this.position.y = constrain(this.position.y, this.sizeHeight / 2, WORLD_HEIGHT - this.sizeHeight / 2);

        return true;
    }
    updateFootsteps(moved) {
        if (moved) {
            if (millis() - this.footstepTimer >= this.footstepInterval) {
                sndFootstep.play();
                this.footstepTimer = millis();
            }
        } else {
            this.footstepTimer = 0;
        }
    }
    drawLight(layer) {
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
                this.lanternState = "flicker";
                this.flickerStrength = 0;
            }
        }
    }
    flicker() {
        if (this.lanternState != "flicker") {
            return;
        }

        // Change this to change how smooth the transition to flickering should be; 1 is sharpest.
        let flickerStrengthSpeed = 0.1;
        this.flickerStrength = lerp(this.flickerStrength, 1, flickerStrengthSpeed);

        // Change this to change how quickly the light flickers.
        let flickerSpeed = 0.01;
        let flickerNoise = noise(frameCount * flickerSpeed + this.noiseOffset);

        // Change these to change by how much the light can flicker by.
        let minChange = -10;
        let maxChange = 20;

        let flicker = map(flickerNoise, 0, 1, minChange, maxChange);

        this.lightDiameter = this.lightMinDiameter + flicker * this.flickerStrength;
    }
    checkLanternCollision(interaction, collisionSize) {
        let collisionRadius = collisionSize / 2;

        if (dist(this.position.x, this.position.y, interaction.position.x, interaction.position.y) <= collisionRadius) {
            interaction.interact();
        }
    }
    checkCollision(position, other) {
        let thisCollisionY = position.y + this.sizeHeight / 2;
        let otherCollisionY = other.position.y + other.sizeHeight / 2;

        let collidingX = abs(position.x - other.position.x) <= (this.collisionWidth + other.collisionWidth) / 2;
        let collidingY = abs(thisCollisionY - otherCollisionY) <= (this.collisionHeight + other.collisionHeight) / 2;

        return collidingX && collidingY;
    }
    getYPivot() {
        return this.position.y + this.sizeHeight / 2;
    }
}