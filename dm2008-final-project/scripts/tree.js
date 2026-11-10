class Tree {
    constructor(position, img) {
        this.position = position;
        this.img = img;
        this.sizeWidth = img.width / 2;
        this.sizeHeight = img.height / 2;

        // Collision variables
        this.collisionWidth = this.sizeWidth * 0.2;
        this.collisionHeight = 15;
    }
    show() {
        push();
        imageMode(CENTER);
        image(this.img, this.position.x, this.position.y, this.sizeWidth, this.sizeHeight);

        //Collision debug box
        // noFill();
        // stroke();
        // rectMode(CENTER);
        // rect(this.position.x, this.position.y + this.sizeHeight / 2, this.collisionWidth, this.collisionHeight);

        pop();
    }
    getYPivot() {
        return this.position.y + this.sizeHeight / 2;
    }
}