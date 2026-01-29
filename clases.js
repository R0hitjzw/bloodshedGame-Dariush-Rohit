class Background {
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

class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        imagesArray = []
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
        this.facing = 'right'

        this.images = imagesArray.map(src => {
            const img = new Image()
            img.src = src
            return img
        })

        // Per defecte usem la primera
        this.image = this.images[0] || new Image()
        if (!imagesArray.length) this.image.src = imageSrc
    }

    draw() {
        c.save()

        if (this.facing === 'left') {
            // Calculem l'amplada real d'un frame multiplicada per l'escala
            const frameWidth = (this.image.width / this.framesMax) * this.scale

            // El truc del mirall: movem el context al centre del personatge i invertim l'eix X
            c.translate(this.position.x + frameWidth / 2 - this.offset.x, 0)
            c.scale(-1, 1)

            c.drawImage(
                this.image,
                -frameWidth / 2, // Dibuixem centrat respecte al translate
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
        } else {
            // Dibuix normal a la dreta
            c.drawImage(
                this.image,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
        }

        c.restore()
    }


    animateFrames() {
        this.framesElapsed++
        

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }

            if (this.images.length > 0) {
                this.image = this.images[this.framesCurrent]
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}


class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        offset = { x: 0, y: 0 },
        imageSrc,
        scale = 1,
        framesMax = 1,
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            offset: attackBox.offset || { x: 0, y: 0 },
            width: attackBox.width || 100,
            height: attackBox.height || 50
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            this.sprites[sprite].imageObjects = this.sprites[sprite].imagesArray.map(src => {
                const img = new Image()
                img.src = src
                return img
            })
        }
    }

    switchSprite(sprite) {
        // EN LA ACTUAL SPRITE, NO REINICIAR
        if (this.currentSprite === sprite) return

        // BLOQUEIG D'ATAC - NO ACABAR FINS QUE S'ACABI L'ANIMACIÓ
        if (
            this.currentSprite === 'hit' &&
            this.framesCurrent < this.sprites.hit.framesMax - 1
        
        ) return

        // Actualitzem l'estat
        this.currentSprite = sprite
        this.images = this.sprites[sprite].imageObjects
        this.framesMax = this.sprites[sprite].framesMax
        this.framesCurrent = 0

        if (sprite === 'hit') {
            this.framesHold = 4 // Muy rápido para el ataque
        } else if (sprite === 'walk') {
            this.framesHold = 8 // Velocidad media
        } else {
            this.framesHold = 35 // Idle más tranquilo
        }
    }

    update() {
        if (this.position.x < enemy.position.x) {
            this.facing = 'right'
        } else {
            this.facing = 'left'
        }

        this.draw()
        if (!this.dead) this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Terra (ajustat a la teva arena)
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 60) {
            this.velocity.y = 0
            this.position.y = canvas.height - 60 - this.height
        } else {
            this.velocity.y += gravity
        }

        if (this.currentSprite === 'hit' && this.framesCurrent === this.sprites.hit.framesMax - 1) {
            this.isAttacking = false
        }
    }
}