// AUDIO DEL JUEGO
const music = document.getElementById("music")
music.volume = 0.3
music.muted = localStorage.getItem("muted") === "true" // respeta mute del menú

let musicStarted = false

// función para arrancar música al primer input
function startMusic() {
    if (musicStarted || music.muted) return
    music.play()
    musicStarted = true
}

// arrancar música con cualquier interacción del jugador
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
        x: 450,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/sprites/claw/idle/1.png",
    framesMax: 1,
    scale: 2.5,
    offset: {
        x: 250,
        y: 200
    },

    sprites: {
        idle: {
            // Ara passem un array amb cada fitxer individual
            imagesArray: [
                './assets/sprites/claw/idle/1.png',
                './assets/sprites/claw/idle/2.png',
                './assets/sprites/claw/idle/3.png',
                './assets/sprites/claw/idle/4.png'
            ],
            framesMax: 4
        },

        walk: {
            // Ara passem un array amb cada fitxer individual
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
            // Ara passem un array amb cada fitxer individual
            imagesArray: [
                './assets/sprites/claw/hit/1.png',
                './assets/sprites/claw/hit/2.png',
                './assets/sprites/claw/hit/3.png',
                './assets/sprites/claw/hit/4.png',
                './assets/sprites/claw/hit/5.png',
                './assets/sprites/claw/hit/6.png'
            ],
            framesMax: 6
        }
    }
})

const enemy = new Fighter({

    position: {
        x: 1155,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/sprites/boxer/idle/1.png",
    framesMax: 1,
    scale: 2.5,
    offset: {
        x: 250,
        y: 200
    },

    sprites: {
        idle: {
            // Ara passem un array amb cada fitxer individual
            imagesArray: [
                './assets/sprites/boxer/idle/1.png',
                './assets/sprites/boxer/idle/2.png',
                './assets/sprites/boxer/idle/3.png',
                './assets/sprites/boxer/idle/4.png'
            ],
            framesMax: 4
        },

        walk: {
            // Ara passem un array amb cada fitxer individual
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
            // Ara passem un array amb cada fitxer individual
            imagesArray: [
                './assets/sprites/boxer/hit/1.png',
                './assets/sprites/boxer/hit/2.png',
                './assets/sprites/boxer/hit/3.png',
                './assets/sprites/boxer/hit/4.png',
                './assets/sprites/boxer/hit/5.png',
                './assets/sprites/boxer/hit/6.png'
            ],
            framesMax: 6
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

    // player movement
    if (player.currentSprite === 'hit' && player.framesCurrent < player.sprites.hit.framesMax - 1) {
        
        // Si está en medio de la animación de ataque, no hacemos nada (bloqueamos otros cambios)
    } else if (keys.s.pressed) {
        player.switchSprite('hit')
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('walk')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('walk')
    } else {
        player.switchSprite('idle')
    }

    // enemy movement
    if (enemy.currentSprite === 'hit' && enemy.framesCurrent < enemy.sprites.hit.framesMax - 1) {
        // Bloqueo de animación de ataque para el enemigo
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
    
    // detectar colision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // fin del juego basado en la vida
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