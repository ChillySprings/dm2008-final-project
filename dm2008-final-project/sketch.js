const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;

// Classes
let player, darkness, camera;

// Images
let imgPlayer, imgGround, imgFlowerClose, imgFlowerOpen, imgMoth, imgLamp;
let imgTree1, imgTree2, imgTree3, imgRuin1, imgRuin2, imgRuin3;

// Sounds
let sndFootstep, sndLamp, sndLantern, sndAmbience;
let ambienceStarted = false;

// Entities
let entities = [];

// Fireflies
let fireflyAmount = 40;
let fireflies = [];

// Moths
let mothAmount = 10;
let moths = [];

// Flowers
let flowerGroups = 4;
let randomFlowerAmount = 30;
let minFlowerDistance = 25;
let flowers = [];

// Obstacles
let obstacles = [];
let obstacleMinDistance = 150;
let playerMinDistance = 50;

// Lamps
let lampAmount = 2;
let lampMinDistance = 400;
let lamps = [];

// Trees
let treeAmount = 15;

// Ruins
let ruinAmount = 4;

let lights = [];

async function setup() {
    createCanvas(500, 500);

    imgPlayer = await loadImage("assets/asset_player.png");
    imgFlowerClose = await loadImage("assets/asset_flower_close.png");
    imgFlowerOpen = await loadImage("assets/asset_flower_open.png");
    imgMoth = await loadImage("assets/asset_moth.png");
    imgGround = await loadImage("assets/asset_ground.png");
    imgLamp = await loadImage("assets/asset_lamp.png");
    imgTree1 = await loadImage("assets/asset_tree_1.png");
    imgTree2 = await loadImage("assets/asset_tree_2.png");
    imgTree3 = await loadImage("assets/asset_tree_3.png");
    imgRuin1 = await loadImage("assets/asset_ruin_1.png");
    imgRuin2 = await loadImage("assets/asset_ruin_2.png");
    imgRuin3 = await loadImage("assets/asset_ruin_3.png");

    sndFootstep = await loadSound("assets/sound_footstep.wav");
    sndLamp = await loadSound("assets/sound_lamp.wav");
    sndLantern = await loadSound("assets/sound_lantern.wav");
    sndAmbience = await loadSound("assets/sound_ambience.wav");

    player = new Player();
    camera = new Camera(createVector(width / 2 - player.position.x, height / 2 - player.position.y));
    darkness = new Darkness();

    spawnEntities();
}

function draw() {
    push();

    // This causes the canvas to move by the player's position
    camera.move(player);
    translate(camera.position.x, camera.position.y);

    imageMode(CORNER);
    image(imgGround, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    if (player.lanternState == "lit") {
        for (let flower of flowers) {
            player.checkLanternCollision(flower, player.lightDiameter);
        }
    }
    for (let flower of flowers) {
        for (let lamp of lamps) {
            if (lamp.state == "lit") {
                lamp.checkLampCollision(flower, lamp.lightDiameter);
            }
        }
    }

    for (let i = 0; i < flowers.length; i++) {
        if (flowers[i].state != "normal") {
            for (let j = 0; j < flowers.length; j++) {
                if (i == j) {
                    continue;
                }
                flowers[i].checkCollision(flowers[j]);
            }
        }
        flowers[i].update();
    }

    if (player.lanternState == "lit") {
        for (let lamp of lamps) {
            player.checkLanternCollision(lamp, player.lightDiameter);
        }
    }

    for (let lamp of lamps) {
        lamp.update();
    }

    for (let firefly of fireflies) {
        firefly.update(fireflies);
    }
    for (let moth of moths) {
        moth.update(lights);
    }
    player.update();

    // y-Sorting based on a yPivot.
    entities.sort((a, b) => {
        return a.getYPivot() - b.getYPivot();
    });
    for (let entity of entities) {
        entity.show();
    }

    darkness.show(lights);

    pop();

    handleInput();
}

function spawnEntities() {
    for (let i = 0; i < fireflyAmount; i++) {
        let firefly = new Firefly(createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT)));
        fireflies.push(firefly);
    }
    spawnFlowers();
    spawnLamps();
    spawnTrees();
    spawnRuins();

    entities.push(player);
    for (let firefly of fireflies) {
        entities.push(firefly);
    }
    for (let flower of flowers) {
        entities.push(flower);
    }
    for (let obstacle of obstacles) {
        entities.push(obstacle);
    }

    lights.push(player);
    for (let firefly of fireflies) {
        lights.push(firefly);
    }
    for (let flower of flowers) {
        lights.push(flower);
    }
    for (let lamp of lamps) {
        lights.push(lamp);
    }

    for (let i = 0; i < mothAmount; i++) {
        let moth = new Moth(createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT)));
        moths.push(moth);
    }
    for (let moth of moths) {
        entities.push(moth);
    }
}

function spawnFlowers() {
    for (let i = 0; i < flowerGroups; i++) {
        let position = createVector(random(WORLD_WIDTH), random(WORLD_HEIGHT));

        // Change this to change the possibility of spawning a cluster of flowers. random() chooses a number between 0 to 1.
        let clusterPossibility = 0.5;
        let choice = random();
        if (choice <= clusterPossibility) {
            spawnFlowerCluster(position);
        }
        else {
            spawnFlowerChain(position);
        }
    }
    // This just spawns flowers randomly with no system.
    for (let i = 0; i < randomFlowerAmount; i++) {
        let position = createVector(random(WORLD_WIDTH), random(WORLD_HEIGHT));
        spawnFlower(position);
    }
}

function spawnFlowerCluster(center) {
    // Change this to change the max amount of flowers per cluster.
    let maxFlowersInCluster = 30;

    for (let i = 0; i < maxFlowersInCluster; i++) {
        let angle = random(TWO_PI);

        // Change this to change how big a cluster can be.
        let clusterRadius = 100;
        let distance = random(clusterRadius);

        let offset = p5.Vector.fromAngle(angle);
        offset.setMag(distance);

        let position = p5.Vector.add(center, offset);

        spawnFlower(position);
    }
}

function spawnFlowerChain(startingPosition) {
    let position = startingPosition.copy();
    let direction = p5.Vector.random2D();
    let noiseOffset = random(1000);

    let maxFlowersInChain = 3;
    for (let i = 0; i < maxFlowersInChain; i++) {
        spawnFlower(position.copy());

        // Change this to change how chaotic the flowers can spawn in a chain.
        let noiseScale = 0.1;
        let noiseValue = noise(i * noiseScale + noiseOffset);

        // Change this to change how "wobbly" a chain of flowers can be.
        let maxAngle = PI / 4;
        let angle = map(noiseValue, 0, 1, -maxAngle, maxAngle);
        direction.rotate(angle);

        let minDistance = minFlowerDistance;
        // Change this to change the max distance away a flower can spawn from another flower in a chain.
        let maxDistance = 40;
        let distance = random(minDistance, maxDistance);
        direction.setMag(distance);

        position.add(direction);
    }
}

function spawnFlower(position) {
    let validPosition = true;

    for (let flower of flowers) {
        let distanceToNeighbour = p5.Vector.dist(position, flower.position);

        if (distanceToNeighbour < minFlowerDistance) {
            validPosition = false;
            break;
        }
    }

    if (validPosition) {
        flowers.push(new Flower(position));
    }
}

function spawnLamps() {
    // Change this to change how many times the code can try spawning lamps before it gives up.
    let maxAttempts = 100;
    let attempts = 0;
    let position = createVector(0, 0)

    for (let i = 0; i < lampAmount; i++) {
        while (maxAttempts > attempts) {
            position = createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT))

            let validPosition = true;

            for (let obstacle of obstacles) {
                let distanceToNeighbour = p5.Vector.dist(position, obstacle.position)

                if (distanceToNeighbour > 0 && distanceToNeighbour < obstacleMinDistance) {
                    validPosition = false;
                    break;
                }
            }
            let distanceToPlayer = p5.Vector.dist(position, player.position);
            if (distanceToPlayer < playerMinDistance) {
                validPosition = false;
                break;
            }
            if (validPosition) {
                let lamp = new Lamp(position);
                lamps.push(lamp);
                obstacles.push(lamp);
                break;
            }
        }
    }
}

function spawnTrees() {
    let maxAttempts = 100;
    let attempts = 0;
    let position = createVector(0, 0)
    let treeImages = [imgTree1, imgTree2, imgTree3];

    for (let i = 0; i < treeAmount; i++) {
        while (maxAttempts > attempts) {
            position = createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT))

            let validPosition = true;

            for (let obstacle of obstacles) {
                let distanceToNeighbour = p5.Vector.dist(position, obstacle.position)

                if (distanceToNeighbour > 0 && distanceToNeighbour < obstacleMinDistance) {
                    validPosition = false;
                    break;
                }
            }
            let distanceToPlayer = p5.Vector.dist(position, player.position);
            if (distanceToPlayer < playerMinDistance) {
                validPosition = false;
                break;
            }
            if (validPosition) {
                obstacles.push(new Tree(position, random(treeImages)));
                break;
            }
        }
    }
}

function spawnRuins() {
    let maxAttempts = 100;
    let attempts = 0;
    let position = createVector(0, 0)
    let ruinImages = [imgRuin1, imgRuin2, imgRuin3];


    for (let i = 0; i < ruinAmount; i++) {
        while (maxAttempts > attempts) {
            position = createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT))

            let validPosition = true;

            for (let obstacle of obstacles) {
                let distanceToNeighbour = p5.Vector.dist(position, obstacle.position)

                if (distanceToNeighbour > 0 && distanceToNeighbour < obstacleMinDistance) {
                    validPosition = false;
                    break;
                }
            }
            let distanceToPlayer = p5.Vector.dist(position, player.position);
            if (distanceToPlayer < playerMinDistance) {
                validPosition = false;
                break;
            }
            if (validPosition) {
                obstacles.push(new Ruin(position, random(ruinImages)));
                break;
            }
        }
    }
}

function handleInput() {
    let inputVector = createVector(0, 0);

    if (keyIsDown("w")) {
        inputVector.y = -1;
    }
    if (keyIsDown("s")) {
        inputVector.y = 1;
    }
    if (keyIsDown("a")) {
        inputVector.x = -1;
    }
    if (keyIsDown("d")) {
        inputVector.x = 1;
    }

    if (!ambienceStarted && (keyIsDown("w") || keyIsDown("a") || keyIsDown("s") || keyIsDown("d") || keyIsDown(" "))) {
        sndAmbience.loop();
        sndAmbience.play();
        ambienceStarted = true;
        console.log("ambience started", sndAmbience.isPlaying(), sndAmbience.isLooping());
    }

    let moved = player.handleMovement(inputVector, obstacles);
    player.updateFootsteps(moved);

    if (keyIsDown(" ")) {
        if (player.lanternState == "flicker") {
            player.lanternState = "lit";
            sndLantern.play();

            for (let firefly of fireflies) {
                // Change this to change how far away fireflies are affected by the lantern's light.
                let fireflyCollisionSize = 300;
                player.checkLanternCollision(firefly, fireflyCollisionSize);
            }
        }
    }
}