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

// NUEVA CLASE PARA FONDOS ANIMADOS
class AnimatedBackground {
    constructor({ position, imagesArray, framesHold = 15 }) {
        this.position = position
        this.images = []
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = framesHold

        // Cargar todas las imágenes
        imagesArray.forEach(src => {
            const img = new Image()
            img.src = src
            this.images.push(img)
        })

        this.currentImage = this.images[0]
    }

    draw() {
        if (!this.currentImage || !this.currentImage.complete) return

        const scale = Math.max(
            canvas.width / this.currentImage.width,
            canvas.height / this.currentImage.height
        )

        const width = this.currentImage.width * scale
        const height = this.currentImage.height * scale

        const x = (canvas.width - width) / 2
        const y = (canvas.height - height) / 2

        c.drawImage(this.currentImage, x, y, width, height)
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.images.length - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }

            this.currentImage = this.images[this.framesCurrent]
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        imagesArray = [],
        facing = 'right'
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
        this.facing = facing

        this.images = imagesArray.map(src => {
            const img = new Image()
            img.src = src
            return img
        })

        // Por defecto usamos la primera
        this.image = new Image()
        if (imagesArray.length > 0) {
            this.image = this.images[0]
        } else {
            this.image.src = imageSrc
        }
    }

    draw() {

        
        if (!this.image || !this.image.complete || this.image.width === 0) return
        c.save()


        if (this.facing === 'left') {
            // Calculamos el ancho real de un frame multiplicado por la escala
            const frameWidth = (this.image.width / this.framesMax) * this.scale

            // Truco del espejo: movemos el context al centro del personaje e invertimos el eje X
            c.translate(this.position.x + frameWidth / 2 - this.offset.x, 0)
            c.scale(-1, 1)

            c.drawImage(
                this.image,
                -frameWidth / 2, // Dibujamos centrado respecto al translate
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
        } else {
            // Dibujo normal a la derecha
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
        // SI ÉS L'ANIMACIÓ DE MORT I ÉS L'ÚLTIM FRAME, ATURA'T AQUÍ
        if (this.currentSprite === 'die' && this.framesCurrent === this.framesMax - 1) {
            return
        }

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
        attackBox = { offset: {}, width: undefined, height: undefined },
        facing = 'right'
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
            facing
        })
        this.velocity = velocity
        this.width = 150
        this.height = 200
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset || { x: 0, y: 0 },
            width: attackBox.width || 150,
            height: attackBox.height || 150
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 0
        this.sprites = sprites
        this.dead = false
        this.hasDealtDamage = false

        for (const sprite in this.sprites) {
            this.sprites[sprite].imageObjects = this.sprites[sprite].imagesArray.map(src => {
                const img = new Image()
                img.src = src
                return img
            })
        }
    }

    attack() {
        this.isAttacking = true
    }

    switchSprite(sprite) {

        if (this.currentSprite === 'die') {
        if (this.framesCurrent === this.sprites.die.framesMax - 1) this.dead = true
        return
    }

        if (sprite === 'die') {
        this.facing = 'right' 
    }

        // EN LA ACTUAL SPRITE, NO REINICIAR
        
        if (this.currentSprite === sprite) return

        if (this.currentSprite === 'die') {
            if (this.framesCurrent === this.sprites.die.framesMax - 1) this.dead = true
            return
        }

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
            this.framesHold = 5
            this.hasDealtDamage = false
        } else if (sprite === 'die') {
            this.framesHold = 15 // Una mica més lent per la mort
        } else if (sprite === 'walk') {
            this.framesHold = 10
        } else {
            this.framesHold = 15
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        // Actualizar posición de attackBox
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Terra (ajustado a la arena)
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