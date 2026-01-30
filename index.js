// AUDIO DEL JUEGO
const music = document.getElementById("music")
music.volume = 0.3
music.muted = localStorage.getItem("muted") === "true"

let musicStarted = false

function startMusic() {
    if (musicStarted || music.muted) return
    music.play()
    musicStarted = true
}

window.addEventListener("keydown", startMusic)
window.addEventListener("mousedown", startMusic)


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Background({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background/snakeThroneArena.webp'
})

const player = new Fighter({
    position: {
        x: 300,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/sprites/claw/idle/1.png",
    framesMax: 1,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 100
    },
    sprites: {
        idle: {
            imagesArray: [
                './assets/sprites/claw/idle/1.png',
                './assets/sprites/claw/idle/2.png',
                './assets/sprites/claw/idle/3.png',
                './assets/sprites/claw/idle/4.png'
            ],
            framesMax: 4
        },

        walk: {
            imagesArray: [
                './assets/sprites/claw/walk/1.png',
                './assets/sprites/claw/walk/2.png',
                './assets/sprites/claw/walk/3.png',
                './assets/sprites/claw/walk/4.png',
                './assets/sprites/claw/walk/5.png',
                './assets/sprites/claw/walk/6.png',
                './assets/sprites/claw/walk/7.png',
                './assets/sprites/claw/walk/8.png'
            ],
            framesMax: 8
        },
        hit: {
            imagesArray: [
                './assets/sprites/claw/hit/1.png',
                './assets/sprites/claw/hit/2.png',
                './assets/sprites/claw/hit/3.png',
                './assets/sprites/claw/hit/4.png',
                './assets/sprites/claw/hit/5.png',
                './assets/sprites/claw/hit/6.png'
            ],
            framesMax: 6
        },

        die: {
            imagesArray: [
                './assets/sprites/claw/die/1.png',
                './assets/sprites/claw/die/2.png',
                './assets/sprites/claw/die/3.png',
                './assets/sprites/claw/die/4.png',
                './assets/sprites/claw/die/5.png'
            ],
            framesMax: 5
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/sprites/boxer/idle/1.png",
    framesMax: 1,
    scale: 2.5,
    offset: {
        x: -120,
        y: 157
    },
    facing: 'left',
    attackBox: {
        offset: {
            x: -100,
            y: 50
        },
        width: 150,
        height: 100
    },
    sprites: {
        idle: {
            imagesArray: [
                './assets/sprites/boxer/idle/1.png',
                './assets/sprites/boxer/idle/2.png',
                './assets/sprites/boxer/idle/3.png',
                './assets/sprites/boxer/idle/4.png'
            ],
            framesMax: 4
        },

        walk: {
            imagesArray: [
                './assets/sprites/boxer/walk/1.png',
                './assets/sprites/boxer/walk/2.png',
                './assets/sprites/boxer/walk/3.png',
                './assets/sprites/boxer/walk/4.png',
                './assets/sprites/boxer/walk/5.png',
                './assets/sprites/boxer/walk/6.png'
            ],
            framesMax: 6
        },

        hit: {
            imagesArray: [
                './assets/sprites/boxer/hit/1.png',
                './assets/sprites/boxer/hit/2.png',
                './assets/sprites/boxer/hit/3.png',
                './assets/sprites/boxer/hit/4.png',
                './assets/sprites/boxer/hit/5.png',
                './assets/sprites/boxer/hit/6.png'
            ],
            framesMax: 6
        },

        die: {
            imagesArray: [
                './assets/sprites/boxer/die/1.png',
                './assets/sprites/boxer/die/2.png',
                './assets/sprites/boxer/die/3.png',
                './assets/sprites/boxer/die/4.png',
                './assets/sprites/boxer/die/5.png'
            ],
            framesMax: 5
        }
    }
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if (player.health <= 0 || enemy.health <= 0) {
        if (player.health <= 0) {
            player.switchSprite('die')
            enemy.switchSprite('idle')
        } else if (enemy.health <= 0) {
            enemy.switchSprite('die')
            player.switchSprite('idle') // GUANYADOR PARA MOVIMENT, TORNA IDLE
        }

        player.isAttacking = false
        enemy.isAttacking = false

        determineWinner({ player, enemy, timerId })
    } else {

        // player movement
        if (player.currentSprite === 'hit' && player.framesCurrent < player.sprites.hit.framesMax - 1) {
            // SI ENMIG D'ANIMACIÓ ATAAC, NO MOURE, NO FER ALTRES ANIMACIONS
        } else if (keys.s.pressed) {
            player.switchSprite('hit')
        } else if (keys.a.pressed && player.lastKey === 'a') {
            player.velocity.x = -5 // enrere
            player.switchSprite('walk')
        } else if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 5 // endavant
            player.switchSprite('walk')
        } else {
            player.switchSprite('idle')
        }

        // enemy movement
        if (enemy.currentSprite === 'hit' && enemy.framesCurrent < enemy.sprites.hit.framesMax - 1) {
            // Bloqueo de animación de ataque
        } else if (keys.ArrowDown.pressed) {
            enemy.switchSprite('hit')
        } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -5
            enemy.switchSprite('walk')
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 5
            enemy.switchSprite('walk')
        } else {
            enemy.switchSprite('idle')
        }
    }

    // detectar colision
    if (
        rectangularCollision({
            rectangle1: player, 
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        !player.hasDealtDamage
    ) {
        console.log('💥 PLAYER HIT ENEMY!')
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        player.hasDealtDamage = true
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        !enemy.hasDealtDamage
    ) {
        console.log('💥 ENEMY HIT PLAYER!')
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
        enemy.hasDealtDamage = true
    }


    // logica de joc qui guanya
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
        case 'D':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
        case 'A':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
        case 'W':
            player.velocity.y = -20
            break
        case 's':
        case 'S':
            keys.s.pressed = true
            player.attack()
            player.lastKey = 's'
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
    }
})