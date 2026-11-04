class Moth {
    constructor(position) {
        this.position = position;
        this.size = 10;

        this.velocity = p5.Vector.random2D().mult(random(0.5, 2));

        this.acceleration = createVector(0, 0);

        this.maxSpeed = random(1.5, 3);

        this.noiseOffset = random(1000);

        this.flutterPhase = random(TWO_PI);
        this.flutterSpeed = random(0.35, 0.7);

        this.pauseTimer = 0;

        this.target = this.randomTarget();

        this.timerMin = 80;
        this.timerMax = 240;
        this.targetTimer = int(random(this.timerMin, this.timerMax));

        this.state = "normal";
    }
    update() {
        this.move();
        this.show();
        this.borders();
    }
    move() {
        if (this.state == "normal") {
            this.chooseRandomTarget();

            if (this.pauseTimer > 0) {
                this.pauseTimer--;
                this.velocity.mult(0.92);
                this.position.add(this.velocity);
                return;
            }

            let pausePossibility = 0.0015;
            if (random() < pausePossibility) {
                let pauseTimerMin = 5;
                let pauseTimerMax = 20;
                this.pauseTimer = int(random(pauseTimerMin, pauseTimerMax));
            }
        }

        let targetForce = p5.Vector.sub(this.target, this.position);
        let targetDistance = targetForce.mag();
        let maxTargetDistance = 500;
        let targetStrength;

        if (this.state == "normal") {
            targetStrength = 0.045;
        }
        else {
            targetStrength = 0.25;
        }

        targetForce.normalize();
        targetForce.mult(map(targetDistance, 0, maxTargetDistance, 0, targetStrength));

        this.acceleration.add(targetForce);
        this.acceleration.add(this.sidewaysMovement());

        if (this.state == "normal") {
            this.acceleration.add(this.wander());
        }

        this.acceleration.add(this.flutterVibration());

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        let drag = 0.96;
        this.velocity.mult(drag);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }
    show() {
        square(this.position.x, this.position.y, this.size)
    }
    randomTarget() {
        let angle = random(TWO_PI);
        let randomX = random(80, 520);
        let randomY = random(50, 360);

        return createVector(width / 2 + cos(angle) * randomX, height / 2 + sin(angle) * randomY);
    }
    chooseRandomTarget() {
        this.targetTimer--;

        if (this.targetTimer <= 0) {
            this.target = this.randomTarget();
            this.targetTimer = int(random(this.timerMin, this.timerMax));
        }
    }
    sidewaysMovement() {
        let side = createVector(-this.velocity.y, this.velocity.x);

        side.normalize();

        let sideNoise = noise(frameCount * 0.01 + this.noiseOffset);
        let maxSideForce = 0.14;
        let sideAmount = map(sideNoise, 0, 1, -maxSideForce, maxSideForce);

        return side.mult(sideAmount);
    }
    wander() {
        let wanderAngle = noise(frameCount * 0.01 + this.noiseOffset) * TWO_PI * 2;
        let wander = p5.Vector.fromAngle(wanderAngle);
        return wander.mult(0.09);
    }
    flutterVibration() {
        let flutterAmount = sin(frameCount * this.flutterSpeed * 10 + this.flutterPhase);
        let flutter = p5.Vector.fromAngle(noise(frameCount * 0.02 + this.noiseOffset) * TWO_PI * 2);
        let flutterForce;

        if (this.state == "normal") {
            flutterForce = 1.2;
        }
        else {
            flutterForce = 0.6;
        }

        return flutter.mult(flutterAmount * flutterForce);
    }
    interact(lantern) {
        this.pauseTimer = 0;
        this.target = lantern.position;
        this.state = "attracted";
    }
    borders() {
        if (this.position.x < -this.size) {
            this.position.x = WORLD_WIDTH + this.size;
        }

        if (this.position.y < -this.size) {
            this.position.y = WORLD_HEIGHT + this.size;
        }

        if (this.position.x > WORLD_WIDTH + this.size) {
            this.position.x = -this.size;
        }

        if (this.position.y > WORLD_HEIGHT + this.size) {
            this.position.y = -this.size;
        }
    }
}