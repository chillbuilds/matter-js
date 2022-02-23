let gameState = {}
let gameDims = {width: 1600, height: 800}

function randNum(min, max) { 
    return Math.random() * (max - min) + min;
} 

function preload() {
    this.load.spritesheet('zombie', '../images/sprites/zombie.png', { frameWidth: 48, frameHeight: 60 })
    this.load.spritesheet('hero', '../images/sprites/julie.png', { frameWidth: 48, frameHeight: 60})
    this.load.image('bullet', '../images/sprites/bullet.png')
    this.load.image('bg', '../images/sprites/bg.jpeg')
    this.load.image('muzzFlash', '../images/sprites/muzzFlash.png')
}
   
function create() {

    gameState.cursors = this.input.keyboard.createCursorKeys()
    // background setup
    gameState.bg = this.add.image(800, 420, 'bg')
    gameState.bg.setScale(3)

    gameState.muzzFlash = this.add.sprite(-500, -500, 'muzzFlash')
    gameState.muzzFlash.setScale(.05)
    gameState.muzzFlash.setAlpha(.8)

    gameState.hitBox = this.add.rectangle(gameDims.width/2, gameDims.height/2, gameDims.width, gameDims.height, 0xBF1363, 0.4)
    gameState.hitBox.setDepth(1000)
    gameState.hitBox.setAlpha(0)

    // hero setup
    gameState.hero = this.physics.add.sprite(400, 400, 'hero')
    gameState.hero.setScale(2.5)
    gameState.hero.setSize(25, 15, true)
    gameState.hero.health = 100
    // gameState.hero.setSize(25, 45, true)

    gameState.zombiesLeft = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        repeat: 50,
        setXY: { x: -100, y: gameDims.height/2 },
        setScale: {x: 2.5, y: 2.5},
        speed: 1.5
    })
    gameState.zombiesRight = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        repeat: 7,
        setXY: { x: gameDims.width+500, y: gameDims.height+500},
        setScale: {x: 2.5, y: 2.5}
    })
    gameState.bullets = this.physics.add.group({
        key: 'bullet',
        repeat: 9,
        setScale: {x: 0.1, y: 0.1}
    })
    gameState.hero.bulletCount = 0


    gameState.zombiesLeft.children.iterateLocal('setSize', 25, 15, true)

    this.anims.create({
        key: 'zombieSpawn',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [0, 1, 2, 3, 4] }),
        frameRate: 8,
        repeat: 0
    })
    this.anims.create({
        key: 'zombieLeft',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [5, 6, 7] }),
        frameRate: 8,
        repeat: -1
    })
    this.anims.create({
        key: 'zombieRight',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [8, 9, 10] }),
        frameRate: 8,
        repeat: -1
    })
    this.anims.create({
        key: 'heroLeft',
        frames: this.anims.generateFrameNumbers('hero', { frames: [0, 1, 2, 3, 4] }),
        frameRate: 8,
        repeat: -1
    })
    this.anims.create({
        key: 'heroRight',
        frames: this.anims.generateFrameNumbers('hero', { frames: [5, 6, 7, 8, 9] }),
        frameRate: 8,
        repeat: -1
    })
    // gameState.zombiesRight.children.iterateLocal('play', 'spawn')
    this.physics.add.collider(gameState.zombiesLeft, gameState.hero, function (_hero, _zombie) {
        _hero.body.enable = false
        gameState.hitBox.setAlpha(60)
        if(_hero.health <= 0){
            _hero.body.enable = false
            // alert('game over!')
        }
        setTimeout(()=>{gameState.hitBox.setAlpha(0)}, 50)
        setTimeout(()=>{
            _hero.body.enable = true
            _hero.health -= 10
        console.log('health: ' + _hero.health)
        }, 500)
        console.log('x: ' + gameState.hero.x)
    })

    this.physics.add.collider(gameState.zombiesLeft, gameState.zombiesLeft, function (_zombie1, _zombie2) {
        if(parseInt(_zombie1.x) == parseInt(_zombie2.x)){
            if(_zombie1.speed < 1.5){_zombie1.speed += 0.25}
            if(_zombie2.speed > .5){_zombie2.speed -= 0.25}
            _zombie1.x += 5
            _zombie2.x -= 5
        }
        if(parseInt(_zombie1.y) == parseInt(_zombie2.y)){
            _zombie1.speed += 0.5
            _zombie2.speed -= 0.5
        }
        if(_zombie1.y > _zombie2.y){_zombie1.setDepth(10);_zombie2.setDepth(1)}
        if(_zombie1.y < _zombie2.y){_zombie1.setDepth(1);_zombie2.setDepth(10)}
    })

    // this.physics.add.collider(gameState.bullets, gameState.zombiesLeft, function (_zombie, _bullets) {
        // _zombie.body.enable = false
        // _zombie.body.embedded = false
    // })

    let enemyLeftSetup = gameState.zombiesLeft.getChildren()
    for(var i = 0; i < enemyLeftSetup.length; i++) {
        enemyLeftSetup[i].x = randNum(-50, -1500)
        enemyLeftSetup[i].y = randNum(gameDims.height/2, gameDims.height)
        enemyLeftSetup[i].speed = randNum(.5, 1.5)
    }

    // this.input.keyboard.on('keydown-SPACE', function (event) {
    //     console.log('Hello from the Space Bar!')
    // })
    // mouse click
    this.input.on('pointerdown', function (pointer) {
        if(gameState.hero.bulletCount < 1){
            gameState.hero.bulletCount = gameState.bullets.children.entries.length
        }
        gameState.hero.bulletCount -= 1

        if(gameState.hero.facing == 'left'){
            gameState.muzzFlash.flipX = false
            gameState.muzzFlash.x = gameState.hero.x-50
            gameState.muzzFlash.y = gameState.hero.y-18

            // bullet.x = gameState.hero.x 
            // bullet.y = gameState.hero.y - 18
        }
        if(gameState.hero.facing == 'right'){
            gameState.muzzFlash.flipX = true
            gameState.muzzFlash.x = gameState.hero.x+50
            gameState.muzzFlash.y = gameState.hero.y-18

            
        }

        setTimeout(()=>{gameState.muzzFlash.x = -500}, 20)

        // console.log(gameState)
        let bullet = gameState.bullets.children.entries[gameState.hero.bulletCount]
        bullet.x = gameState.hero.x 
        bullet.y = gameState.hero.y - 18
        let bulletphys = this.physics.moveTo(bullet, game.input.mousePointer.x, game.input.mousePointer.y, 5000)
        bullet.rotation = bulletphys
        bullet.setXY = {x: gameState.hero.x, y: gameState.hero.y}
        // gameState.bullet = 45
        // this.add.image(pointer.x, pointer.y, 'logo')
    }, this)

        this.physics.add.collider(gameState.bullets, gameState.zombiesLeft, function (_bullet, _zombie) {
        _zombie.x = 200
        _bullet.x = -500
        // _zombie.body.enable = false
        // _zombie.body.embedded = false
        // _bullet.body.enable = false
        // _bullet.body.embedded = false
    })

    // gameState.hero.play('spawn')
}

function update() {

    // console.log(Phaser.Math.Angle.BetweenY(gameState.hero.x, gameState.hero.y, game.input.mousePointer.x, game.input.mousePointer.y))

    if(gameState.hero.y <= 345){
        gameState.hero.y += 5
    }
    if(gameState.hero.y >= 775){
        gameState.hero.y -= 5
    }
    if(gameState.hero.x <= 10){
        gameState.hero.x += 5
    }
    if(gameState.hero.x >= 1585){
        gameState.hero.x -= 5
    }
    // parseInt(game.input.mousePointer.x)
    //     parseInt(game.input.mousePointer.y)
    if(parseInt(game.input.mousePointer.x) < gameState.hero.x){
        gameState.hero.facing = 'left'
        gameState.hero.play('heroLeft', true)
    }
    if(parseInt(game.input.mousePointer.x) > gameState.hero.x){
        gameState.hero.facing = 'right'
        gameState.hero.play('heroRight', true)
    }

    gameState.hero.setVelocity(0)
    if(gameState.cursors.left.isDown)
    {gameState.hero.x -= 5}
    if(gameState.cursors.right.isDown)
    {gameState.hero.x += 5}
    if(gameState.cursors.up.isDown)
    {gameState.hero.y -= 5}
    if(gameState.cursors.down.isDown)
    {gameState.hero.y += 5}

    let enemyLeftRead = gameState.zombiesLeft.getChildren()
    for(var i = 0; i < enemyLeftRead.length; i++) {
        // let rand = parseFloat(randNum(1.5, 2)).toFixed(1)
        if(enemyLeftRead[i].x > gameState.hero.x){
            enemyLeftRead[i].x -= enemyLeftRead[i].speed
            enemyLeftRead[i].play('zombieLeft', true)
        }
        if(enemyLeftRead[i].x < gameState.hero.x){
            enemyLeftRead[i].x += enemyLeftRead[i].speed
            enemyLeftRead[i].play('zombieRight', true)
        }
        if(enemyLeftRead[i].y > gameState.hero.y){
            enemyLeftRead[i].y -= enemyLeftRead[i].speed
            // enemyRead[i].play('left', true)
        }
        if(enemyLeftRead[i].y < gameState.hero.y){
            enemyLeftRead[i].y += enemyLeftRead[i].speed
            // enemyRead[i].play('right', true)
        }

        if(gameState.hero.y > enemyLeftRead[i].y){
            gameState.hero.setDepth(10)
            enemyLeftRead[i].setDepth(1)
        }
        if(gameState.hero.y < enemyLeftRead[i].y){
            gameState.hero.setDepth(1)
            enemyLeftRead[i].setDepth(10)
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: gameDims.width,
    height: gameDims.height,
    backgroundColor: "#2E86AB",
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    parent: 'canvasContainer',
    scene: {
        preload,
        create,
        update
    }
  };
  
  const game = new Phaser.Game(config)