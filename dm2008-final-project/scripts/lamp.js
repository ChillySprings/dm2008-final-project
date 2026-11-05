class Lamp {
    constructor(position) {
        this.position = position;
        this.lightDiameter = 150;
    }
    drawLight(layer) {
        layer.circle(this.position.x, this.position.y, this.lightDiameter);
    }
}