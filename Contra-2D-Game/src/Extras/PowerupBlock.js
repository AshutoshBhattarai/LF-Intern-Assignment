class PowerupBlock {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.hit = 3;
        this.animationTimer = 0;
        this.isOpen = false;
        this.height = TILE_SIZE * 2;
        this.width = TILE_SIZE * 2;
        this.image = new Image();
        this.image.src = './assets/images/Contra-Tanks.gif';
        this.frame = 0;
        this.state = blockPowerupSprite[this.frame];
    }
    draw(ctx) {
        const { x, y, height, width } = this.state;
        ctx.drawImage(this.image, x, y, width, height, this.xAxis, this.yAxis - 5, this.width, this.height);
    }

    update(player) {
        const distance = Math.abs(player.xAxis - this.xAxis)
        if (distance < TILE_SIZE * 10 && !this.isOpen && !this.hit == 0) {
            this.animateOpening();
        }
        if (distance > TILE_SIZE * 10 && this.isOpen) {
            this.animateClosing()
        }

        if (this.isOpen) {
            if (this.hit == 3) { this.state = blockPowerupSprite[3]; }

            if (this.hit == 2) {
                this.frame = 4;
                this.state = blockPowerupSprite[4]
            }

            if (this.hit == 1) {
                this.frame = 5;
                this.state = blockPowerupSprite[5]
            }

            if (this.hit == 0) {
                this.animateClosing()
            }
        }

    }
    animateOpening() {
        this.animationTimer++;
        if (this.animationTimer % 15 == 0 && !this.animationTimer == 0) {
            this.frame++;
            this.state = blockPowerupSprite[this.frame];

            if (this.frame == 3) {

                this.animationTimer == 0;
                this.isOpen = true;
            }
        }
    }
    animateClosing() {
        this.isOpen = false
        this.state = blockPowerupSprite[0]
        this.frame = 0
    }
}