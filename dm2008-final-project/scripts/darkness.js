class Darkness {
    constructor() {
        this.layer = createGraphics(WORLD_WIDTH, WORLD_HEIGHT);

        // Change this to change the darkness colour; the last number is the alpha value.
        this.darknessColour = "rgba(0, 0, 0, 0.95)";
    }
    show(lights) {
        this.drawDarkness(lights);
        image(this.layer, 0, 0);
    }
    drawDarkness(lights) {
        // Resets to complete darkness.
        push();
        this.layer.clear();
        this.layer.noStroke();
        this.layer.fill(this.darknessColour);
        this.layer.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Then erase holes into it
        this.layer.erase();

        for (let light of lights) {
            light.drawLight(this.layer);
        }

        this.layer.noErase();
        pop();
    }
}