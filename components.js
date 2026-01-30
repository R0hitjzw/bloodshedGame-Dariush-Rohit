
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    const ui = document.querySelector('#gameOverUI')
    const text = document.querySelector('#winnerName')
    
    setTimeout(() => {
        ui.style.display = 'flex'
    }, 1000)

    if (player.health === enemy.health) {
        text.innerHTML = 'Empate'
    } else if (player.health > enemy.health) {
        text.innerHTML = 'PLAYER 1 WINS'
    } else {
        text.innerHTML = 'PLAYER 2 WINS'
    }
}

let timer = 20
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}