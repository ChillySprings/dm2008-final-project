class Camera {
    constructor(position) {
        this.position = position;
    }
    update(player) {
        this.move();
    }
    move(player) {
        this.position.x = width / 2 - player.position.x;
        this.position.y = height / 2 - player.position.y;

        this.position.x = constrain(this.position.x, width - WORLD_WIDTH, 0);
        this.position.y = constrain(this.position.y, height - WORLD_HEIGHT, 0);
    }
}