const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;

// Classes
let player, darkness, camera;

// Images
let imgPlayer, imgGround, imgFlowerClose, imgFlowerOpen, imgMoth;

// Fireflies
let fireflyAmount = 20;
let fireflies = [];

// Moths
let mothAmount = 5;
let moths = [];

// Flowers
let flowers = [];

// Lamps
let lampAmount = 10;
let lamps = [];

let lights = [];

async function setup() {
    createCanvas(500, 500);
    imgPlayer = await loadImage("assets/asset_player.png");
    imgFlowerClose = await loadImage("assets/asset_flower_close.png");
    imgFlowerOpen = await loadImage("assets/asset_flower_open.png");
    imgMoth = await loadImage("assets/asset_moth.png");
    imgGround = await loadImage("assets/asset_ground.png");

    player = new Player();
    camera = new Camera(createVector(width / 2 - player.position.x, height / 2 - player.position.y));

    lights.push(player);

    darkness = new Darkness();

    for (let i = 0; i < fireflyAmount; i++) {
        let firefly = new Firefly(createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT)));
        fireflies.push(firefly);
    }

    for (let i = 0; i < lampAmount; i++) {
        let lamp = new Lamp(createVector(random(0, WORLD_WIDTH), random(0, WORLD_HEIGHT)));
        lamps.push(lamp);
    }

    flowers.push(new Flower(createVector(200, 200)));
    flowers.push(new Flower(createVector(230, 200)));
    flowers.push(new Flower(createVector(260, 200)));
    flowers.push(new Flower(createVector(290, 200)));

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
}

function draw() {
    background("#ffffff");

    push();

    camera.move(player);
    translate(camera.position.x, camera.position.y);

    imageMode(CORNER);
    image(imgGround, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    if (player.lanternState != "off") {
        for (let flower of flowers) {
            player.checkCollision(flower, player.lightDiameter);
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

    for (let moth of moths) {
        if (player.lanternState == "off") {
            moth.state = "normal";
        }
        moth.update(lights);
    }

    for (let firefly of fireflies) {
        firefly.update(fireflies);
    }

    player.update();
    darkness.show(lights);

    pop();

    handleInput();
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

    player.handleMovement(inputVector);

    if (mouseIsPressed) {
        if (player.lanternState == "off") {
            print(player.lanternState);
            player.lanternState = "lit";

            for (let firefly of fireflies) {
                player.checkCollision(firefly, player.lightMaxDiameter);
            }
        }
    }
} 