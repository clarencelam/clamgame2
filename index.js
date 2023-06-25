const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x: 600,
        y: 225
    },
    imageSrc: './img/shop.png',
    scale: 2,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    }, 
    imageSrc: './img/samuraiMack/Sprites/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 150,
        y: 100
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Sprites/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './img/samuraiMack/Sprites/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './img/samuraiMack/Sprites/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/samuraiMack/Sprites/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './img/samuraiMack/Sprites/Attack1.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x:0,
            y:0
        },
        width: 100,
    }
})

// instantiate enemy player
const enemy = new Fighter({
    position: {
        x: 500,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Sprites/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 150,
        y: 110
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Sprites/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './img/kenji/Sprites/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './img/kenji/Sprites/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/kenji/Sprites/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './img/kenji/Sprites/Attack1.png',
            framesMax: 4
        }
    }
})

// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else{
        player.switchSprite('idle')
    }

    if(player.velocity.y<0){
        player.switchSprite('jump')
    } else if(player.velocity.y>0){
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run')
        enemy.velocity.x = -5
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run')
        enemy.velocity.x = 5
    } else{
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y<0){
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }

    // Detect Attack Collision
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        console.log('enemy attack successful')
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <=0){
        document.querySelector("#displayText").style.display = "flex"
        determineWinner({player, enemy, timerID})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y -= 20
            break
        case ' ':
            player.attack()
            break

        // arrow key listeners
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y -= 10
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
    console.log(event.key);
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
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
    }
})