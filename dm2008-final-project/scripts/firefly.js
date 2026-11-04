class Firefly {
    constructor(position) {
        this.position = position;
        this.size = 10;

        this.lightState = "off";
        this.lightDiameter = 0;
        this.lightMaxDiameter = 20;
        this.litSpeed = 0.25;
        this.dimSpeed = 0.25;

        this.timerState = "start";
        this.startTime;
        this.timerDuration = random(5000, 10000);

        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.maxSpeed = 3;
        this.maxForce = 0.05;
    }
    update(fireflies) {
        this.move(fireflies);
        this.show();
        this.pulse();
        this.borders();
    }
    interact() {
        this.timerState = "start";
        this.lightState = "lit";
    }
    show() {
        push();
        circle(this.position.x, this.position.y, this.size);
        pop();
    }
    move(fireflies) {
        this.flock(fireflies);
        // Update velocity
        this.velocity.add(this.acceleration);

        // Limit speed
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }
    flock(fireflies) {
        let separation = this.separate(fireflies);
        let alignment = this.align(fireflies);
        let cohesion = this.cohesion(fireflies);

        // Arbitrarily weight these forces
        let separationMultiplier = 1.5;
        separation.mult(separationMultiplier);

        let alignmentMultiplier = 1;
        alignment.mult(alignmentMultiplier);

        let cohesionMultiplier = 1;
        cohesion.mult(cohesionMultiplier);

        // Add the force vectors to acceleration
        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }
    separate(fireflies) {
        let desiredSeparation = 25.0;
        let steer = createVector(0, 0);
        let count = 0;

        // For every boid in the system, check if it's too close
        for (let firefly of fireflies) {
            let distanceToNeighbor = p5.Vector.dist(this.position, firefly.position);

            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if (distanceToNeighbor > 0 && distanceToNeighbor < desiredSeparation) {
                // Calculate vector pointing away from neighbor
                let direction = p5.Vector.sub(this.position, firefly.position);
                direction.normalize();

                // Scale by distance
                direction.div(distanceToNeighbor);
                steer.add(direction);

                // Keep track of how many
                count++;
            }
        }

        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }
    align(fireflies) {
        let neighborDistance = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < fireflies.length; i++) {
            let distance = p5.Vector.dist(this.position, fireflies[i].position);
            if (distance > 0 && distance < neighborDistance) {
                sum.add(fireflies[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }
    cohesion(fireflies) {
        let neighborDistance = 50;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < fireflies.length; i++) {
            let distance = p5.Vector.dist(this.position, fireflies[i].position);
            if (distance > 0 && distance < neighborDistance) {
                sum.add(fireflies[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum); // Steer towards the location
        } else {
            return createVector(0, 0);
        }
    }
    seek(target) {
        // A vector pointing from the location to the target
        let desired = p5.Vector.sub(target, this.position);

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxSpeed);

        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);

        // Limit to maximum steering force
        steer.limit(this.maxForce);
        return steer;
    }
    drawLight(mask) {
        this.changeLightSize();
        mask.circle(this.position.x, this.position.y, this.lightDiameter);
    }
    changeLightSize() {
        if (this.lightState == "lit") {
            this.lightDiameter = lerp(this.lightDiameter, this.lightMaxDiameter, this.litSpeed);

            if (round(this.lightDiameter) == this.lightMaxDiameter) {
                this.lightDiameter = this.lightMaxDiameter;
                this.lightState = "dim";
            }
        }
        // Then it reduces in size until it is no more.
        else if (this.lightState == "dim") {
            this.lightDiameter = lerp(this.lightDiameter, 0, this.dimSpeed);

            if (round(this.lightDiameter) == 1) {
                this.lightDiameter = 0;
                this.lightState = "off";
            }
        }
    }
    pulse() {
        if (this.timerState == "start") {
            this.startTime = millis();
            this.timerState = "waiting";
        }
        else if (this.timerState == "waiting") {
            let elapsed = millis() - this.startTime;

            if (elapsed >= this.timerDuration) {
                this.timerState = "start";
                this.lightState = "lit";
            }
        }
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
