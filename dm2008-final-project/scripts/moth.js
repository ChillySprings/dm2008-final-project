class Moth {
    constructor(position) {
        this.position = position;
        this.sizeWidth = 15;
        this.sizeHeight = 10;

        // Movement variables.
        this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
        this.acceleration = createVector(0, 0);
        this.maxSpeed = random(1.5, 3);
        this.noiseOffset = random(1000);
        this.proximityFromLight;
        this.flutterPhase = random(TWO_PI);
        this.flutterSpeed = random(0.35, 0.7);
        this.pauseTimer = 0;
        this.target = this.findBestTarget(lights);
        // These just change how often the moth should pick a new random target.
        this.timerMin = 80;
        this.timerMax = 240;
        this.targetTimer = int(random(this.timerMin, this.timerMax));
    }
    update(lights) {
        this.move(lights);
        this.borders();
    }
    move(lights) {
        // Every time it moves, it checks if it should change target.
        this.chooseTarget(lights);

        this.calculateProximity();

        // pauseTimer exists to give the moth "breathing room" so it doesn't always do all of its behaviours.
        if (this.pauseTimer > 0) {
            this.pauseTimer--;
            // It takes its current velocity (based on its previous movement) and multiplies it by a force.

            // Change this to change how much should the moth move by when it is moving normally.
            let pauseForce = 0.92;
            this.velocity.mult(pauseForce);

            this.position.add(this.velocity);
            return;
        }

        // Change this to change how frequently should the pause happen. random() chooses a number between 0 to 1.
        let pausePossibility = 0.0015;
        if (random() < pausePossibility) {
            // Change these to change how long should the moth be allowed to "pause" for.
            let pauseTimerMin = 5;
            let pauseTimerMax = 20;
            this.pauseTimer = int(random(pauseTimerMin, pauseTimerMax));
        }

        this.acceleration.add(this.targetMovement());
        this.acceleration.add(this.sidewaysMovement());
        this.acceleration.add(this.wander());
        this.acceleration.add(this.flutterVibration());

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        // Change this to change by how much should the moth be slowed down by.
        let drag = 0.96;
        this.velocity.mult(drag);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }
    show() {
        push();
        imageMode(CENTER);
        image(imgMoth, this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);
        pop();
    }
    chooseTarget(lights) {
        // The moth calculates a new target based on a timer.
        this.targetTimer--;

        if (this.targetTimer <= 0) {
            this.target = this.findBestTarget(lights);
            // The timer changes how long it is every time a target is found.
            this.targetTimer = int(random(this.timerMin, this.timerMax));
        }
    }
    findBestTarget(lights) {
        let target;
        let highestAttractionScore = 0;
        // This searches all the lights to find the one with the highestAttractionScore.
        for (let light of lights) {
            let attractionScore = this.calculateAttractionScore(light);

            if (attractionScore > highestAttractionScore) {
                highestAttractionScore = attractionScore;
                target = light;
            }
        }
        return target;
    }
    calculateAttractionScore(light) {
        // attractionScore is calculated by the lightDiameter divided by the distance away from it.
        let distance = p5.Vector.dist(this.position, light.position);

        // Change this to change how much more important is the light over the distance away from it; 1 is default.
        let lightDiameterImportance = 2;
        return pow(light.lightDiameter, lightDiameterImportance) / distance;
    }
    calculateProximity() {
        // This calculates a distance away from the light.
        let distance = p5.Vector.dist(this.position, this.target.position);
        let lightRadius = this.target.lightDiameter / 2;
        let distanceFromLight = distance - lightRadius;

        // Change this to change by how far should the proximity to the light affect the moth's behaviour.
        let distanceAwayFromLight = 200;
        // This changes the values to 0 to 1.
        this.proximityFromLight = map(distanceFromLight, distanceAwayFromLight, 0, 0, 1);
    }
    targetMovement() {
        // This calculates a vector from the moth's position to the target.
        let target = p5.Vector.sub(this.target.position, this.position);
        target.normalize();

        // Change these to change by how much the moth should be allowed to move sideways by depending on the proximity to the light.
        let furthestMaxTarget = 1;
        let nearestMaxTarget = 0.2;
        let proximityMultiplier = lerp(furthestMaxTarget, nearestMaxTarget, this.proximityFromLight);

        // Change this to change by how much should the moth move towards its target.
        let targetForce = 0.1

        target.mult(proximityMultiplier);
        target.mult(targetForce);

        return target;
    }
    sidewaysMovement() {
        // This creates a vector perpendicular to the current velocity.
        let side = createVector(-this.velocity.y, this.velocity.x);
        side.normalize();

        // Change these to change by how much the moth should be allowed to move sideways by depending on the proximity to the light.
        let furthestMaxSide = 0.2;
        let nearestMaxSide = 1;
        let proximityMultiplier = lerp(furthestMaxSide, nearestMaxSide, this.proximityFromLight);

        let sideNoise = noise(frameCount * 0.01 + this.noiseOffset);
        // Change this to change by how much should the moth be allowed to move sideways by.
        let maxSideForce = 0.14;
        let sideAmount = map(sideNoise, 0, 1, -maxSideForce, maxSideForce);

        side.mult(proximityMultiplier);
        side.mult(sideAmount);

        return side;
    }
    wander() {
        // This creates a random angle based on the random noiseOffset.
        let wanderAngle = noise(frameCount * 0.01 + this.noiseOffset) * TWO_PI * 2;
        // And this creates a vector based on that angle from its current position.
        let wander = p5.Vector.fromAngle(wanderAngle);

        // Change these to change by how much the moth should be allowed to wander randomly by depending on the proximity to the light.
        let furthestMaxWander = 0.2;
        let nearestMaxWander = 1;
        let proximityMultiplier = lerp(furthestMaxWander, nearestMaxWander, this.proximityFromLight);

        // Change this to change by how much should the moth move based on its want to wander.
        let wanderForce = 0.05;

        wander.mult(proximityMultiplier);
        wander.mult(wanderForce);

        return wander;
    }
    flutterVibration() {
        let flutterAmount = sin(frameCount * this.flutterSpeed * 10 + this.flutterPhase);
        // And this creates a vector based on that angle from its current position.
        let flutter = p5.Vector.fromAngle(noise(frameCount * 0.02 + this.noiseOffset) * TWO_PI * 2);

        // Change these to change by how much the moth should be allowed to vibrate depending on the proximity to the light.
        let furthestMaxFlutter = 0.3;
        let nearestMaxFlutter = 1;
        let proximityMultiplier = lerp(furthestMaxFlutter, nearestMaxFlutter, this.proximityFromLight);

        // Change this to change by how much should the moth vibrate by.
        let flutterForce = 0.5;

        flutter.mult(proximityMultiplier);
        flutter.mult(flutterAmount * flutterForce)

        return flutter;
    }
    borders() {
        // Just wraps the fireflies around the world borders.
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
    getYPivot() {
        return this.position.y + this.sizeHeight / 2;
    }
}