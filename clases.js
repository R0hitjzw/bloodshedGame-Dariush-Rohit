class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc

    }

    draw() {
    if (!this.image.complete) return

    const scale = Math.max(
        canvas.width / this.image.width,
        canvas.height / this.image.height
    )

    const width = this.image.width * scale
    const height = this.image.height * scale

    const x = (canvas.width - width) / 2
    const y = (canvas.height - height) / 2

    c.drawImage(this.image, x, y, width, height)
}
 
    update() {
        this.draw()
    }
}

class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height-60) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}