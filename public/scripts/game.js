
let gameState = {}
let gameDims = {width: 1200, height: 600}

function randNum(min, max) { 
    return Math.random() * (max - min) + min;
} 

function preload() {
    this.load.spritesheet('zombie', '../images/sprites/zombie.png', { frameWidth: 192, frameHeight: 240 })
    this.load.spritesheet('hero', '../images/sprites/julie.png', { frameWidth: 192, frameHeight: 240})
    this.load.image('arm', '../images/sprites/arm.png')
    this.load.image('bullet', '../images/sprites/bullet.png')
    this.load.image('bg', '../images/sprites/background.png')
    this.load.image('muzzFlash', '../images/sprites/muzzFlash.png')
    this.load.image('weapon', '../images/sprites/raygun.png')
    this.load.image('hitBox', '../images/sprites/hitbox.png')
}
   
function create() {

    gameState.cursors = this.input.keyboard.createCursorKeys()
    // background setup
    gameState.bg = this.add.image(gameDims.width/2, gameDims.height/2, 'bg')

    gameState.muzzFlash = this.add.sprite(-500, -500, 'muzzFlash')
    gameState.muzzFlash.setScale(.05)
    gameState.muzzFlash.setAlpha(.8)

    gameState.hitEffect = this.add.rectangle(gameDims.width/2, gameDims.height/2, gameDims.width, gameDims.height, 0xBF1363, 0.4)
    gameState.hitEffect.setDepth(1000)
    gameState.hitEffect.setAlpha(0)

    // hero setup
    gameState.hero = this.physics.add.sprite(600, 450, 'hero')
    // gameState.hero.setScale(2.5)
    gameState.hero.setSize(25, 15, true)
    gameState.hero.health = 100
    gameState.hero.setSize(25, 45, true)

    gameState.heroArm = this.add.sprite(-500, -500, 'arm')

    gameState.weapon = this.add.sprite(400, 400, 'weapon')
    gameState.weapon.setScale(0.25)

    gameState.zombies = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        // repeat: 9,
        setXY: {x: 300, y: 400},
        speed: 1.5
    })
    gameState.zombieBody = this.physics.add.group({
        key: 'hitBox',
        repeat: gameState.zombies.children.entries.length-1,
        setXY: {x: 300, y: 400},
        setScale: {x:0.175, y: 0.4},
    })
    gameState.zombieHead = this.physics.add.group({
        key: 'hitBox',
        repeat: gameState.zombies.children.entries.length-1,
        setXY: {x: 600, y: 400},
        setScale: {x:0.175, y: 0.15}
    })
    gameState.bullets = this.physics.add.group({
        key: 'bullet',
        repeat: 9,
        setScale: {x: 0.08, y: 0.08}
    })
    gameState.hero.bulletCount = 0


    gameState.zombies.children.iterateLocal('setSize', 25, 15, true)

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
        key: 'zombieDie',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }),
        frameRate: 12,
        repeat: 0
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
    this.anims.create({
        key: 'heroDieLeft',
        frames: this.anims.generateFrameNumbers('hero', { frames: [10, 11, 12, 13, 14, 15, 16, 17, 18] }),
        frameRate: 8,
        repeat: 0
    })
    this.anims.create({
        key: 'heroDieRight',
        frames: this.anims.generateFrameNumbers('hero', { frames: [19, 20, 21, 22, 23, 24, 25, 26, 27] }),
        frameRate: 8,
        repeat: 0
    })
    // gameState.zombiesRight.children.iterateLocal('play', 'spawn')
    this.physics.add.collider(gameState.zombies, gameState.hero, function (_hero, _zombie) {
        _hero.body.enable = false
        gameState.hitEffect.setAlpha(60)
        if(_hero.health <= 0){
            _hero.body.enable = false
            // alert('game over!')
        }
        setTimeout(()=>{gameState.hitEffect.setAlpha(0)}, 50)
        setTimeout(()=>{
            _hero.body.enable = true
            _hero.health -= 10
        console.log('health: ' + _hero.health)
        }, 500)
        console.log('x: ' + gameState.hero.x)
    })

    this.physics.add.collider(gameState.zombieBody, gameState.bullets, function (_hitbox, _bullet) {
        _bullet.x = -5000
        console.log('body collision dewtected')
    })
    this.physics.add.collider(gameState.zombieHead, gameState.bullets, function (_hitbox, _bullet) {
        _bullet.x = -5000
        console.log('head collision dewtected')
    })

    this.physics.add.collider(gameState.zombies, gameState.zombies, function (_zombie1, _zombie2) {
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

    let enemyLeftSetup = gameState.zombies.getChildren()
    for(var i = 0; i < enemyLeftSetup.length; i++) {
        // enemyLeftSetup[i].x = randNum(-50, -1500)
        // enemyLeftSetup[i].y = randNum(gameDims.height/2, gameDims.height)
        enemyLeftSetup[i].speed = randNum(.5, 1.5)
        enemyLeftSetup[i].active = true
        enemyLeftSetup[i].health = 100
        enemyLeftSetup[i].body.setImmovable(true)
    }

    let zombieBodySetup = gameState.zombieBody.getChildren()
    for(var i = 0; i < zombieBodySetup.length; i++){
        zombieBodySetup[i].setDepth(101)
        zombieBodySetup[i].setOrigin(.2, 0.3)
        zombieBodySetup[i].body.setImmovable(true)
    }
    let zombieHeadSetup = gameState.zombieHead.getChildren()
    for(var i = 0; i < zombieBodySetup.length; i++){
        zombieHeadSetup[i].setDepth(101)
        zombieHeadSetup[i].setOrigin(.2, 0.3)
        zombieHeadSetup[i].body.setImmovable(true)
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

        // if(gameState.hero.facing == 'left'){
        //     gameState.muzzFlash.flipX = false
        //     gameState.muzzFlash.x = gameState.hero.x-50
        //     gameState.muzzFlash.y = gameState.hero.y-18

        //     // bullet.x = gameState.hero.x 
        //     // bullet.y = gameState.hero.y - 18
        // }
        // if(gameState.hero.facing == 'right'){
        //     gameState.muzzFlash.flipX = true
        //     gameState.muzzFlash.x = gameState.hero.x+50
        //     gameState.muzzFlash.y = gameState.hero.y-18

            
        // }

        setTimeout(()=>{gameState.muzzFlash.x = -500}, 20)

        // console.log(gameState)
        let bullet = gameState.bullets.children.entries[gameState.hero.bulletCount]
        // bullet offset
        if(gameState.hero.facing == 'left'){
            bullet.setOrigin(-5.8, -.2)
            bullet.x = gameState.weapon.x
            bullet.y = gameState.weapon.y
            }
        if(gameState.hero.facing == 'right'){
            bullet.setOrigin(-5.8, 1)
            bullet.x = gameState.weapon.x
            bullet.y = gameState.weapon.y
        }
        let bulletphys = this.physics.moveTo(bullet, game.input.mousePointer.x, game.input.mousePointer.y, 4000)
        bullet.rotation = bulletphys
    }, this)

        this.physics.add.collider(gameState.bullets, gameState.zombies, function (_bullet, _zombie) {
        _zombie.setVelocityX(0)
        _zombie.setVelocityY(0)
        _zombie.health -= 10
        console.log('zombie health:' + _zombie.health)
        if(_zombie.health <= 0){
            _zombie.active = false
        }

        // /remove bullet from frame
        _bullet.setVelocityX(0)
        _bullet.setVelocityY(0)
        _bullet.x = -2000
    })

    gameState.zombies.children.entries[0].play('zombieLeft')
    // gameState.zombies.children.entries[0].anims.stop()

}

function update() {

    if(gameState.cursors.left.isUp && gameState.cursors.right.isUp && gameState.cursors.up.isUp && gameState.cursors.down.isUp)
    {gameState.hero.anims.stop()}

    // bounds boundaries
    if(gameState.hero.y <= 400){
        gameState.hero.y += 5}
    if(gameState.hero.y >= 525){
        gameState.hero.y -= 5}
    if(gameState.hero.x <= 24){
        gameState.hero.x += 5}
    if(gameState.hero.x >= 1050){
        gameState.hero.x -= 5}
        
    if(parseInt(game.input.mousePointer.x) < gameState.hero.x){
        gameState.hero.facing = 'left'
        gameState.hero.play('heroLeft', true)
    }
    if(parseInt(game.input.mousePointer.x) > gameState.hero.x){
        gameState.hero.facing = 'right'
        gameState.hero.play('heroRight', true)
    }

    // hero arm
    if(gameState.hero.facing == 'left'){
        gameState.heroArm.flipX = true
        gameState.heroArm.flipY = true
        gameState.heroArm.setOrigin(0.1, 0.66)
        gameState.heroArm.x = gameState.hero.x + 6
        gameState.heroArm.y = gameState.hero.y - 19
        gameState.heroArm.rotation = (Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y))
        gameState.weapon.flipY = true
        gameState.weapon.setOrigin(-.38, .45)
        gameState.weapon.x = gameState.hero.x + 6
        gameState.weapon.y = gameState.hero.y - 19
        gameState.weapon.rotation = (Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y))
    }
    if(gameState.hero.facing == 'right'){
        gameState.heroArm.flipX = true
        gameState.heroArm.flipY = false
        gameState.heroArm.x = gameState.hero.x - 6
        gameState.heroArm.y = gameState.hero.y - 19
        gameState.heroArm.setOrigin(0.1, 0.33)
        gameState.heroArm.rotation = Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y)
        gameState.weapon.flipY = false
        gameState.weapon.setOrigin(-.38, .45)
        gameState.weapon.x = gameState.hero.x - 8
        gameState.weapon.y = gameState.hero.y - 24
        gameState.weapon.rotation = (Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y))
    }

    // hero movement and animation
    gameState.hero.setVelocity(0)
    if(gameState.cursors.left.isDown){
        gameState.hero.x -= 5}
    if(gameState.cursors.right.isDown){
        gameState.hero.x += 5}
    if(gameState.cursors.up.isDown){
        gameState.hero.y -= 5
        if(parseInt(game.input.mousePointer.x) < gameState.hero.x){
            gameState.hero.facing = 'left'
            gameState.hero.play('heroLeft', true)
        }
        if(parseInt(game.input.mousePointer.x) > gameState.hero.x){
            gameState.hero.facing = 'right'
            gameState.hero.play('heroRight', true)
        }
    }
    if(gameState.cursors.down.isDown){
        gameState.hero.y += 5
        if(parseInt(game.input.mousePointer.x) < gameState.hero.x){
            gameState.hero.facing = 'left'
            gameState.hero.play('heroLeft', true)
        }
        if(parseInt(game.input.mousePointer.x) > gameState.hero.x){
            gameState.hero.facing = 'right'
            gameState.hero.play('heroRight', true)
        }
    }
    let enemyRead = gameState.zombies.getChildren()
    for(var i = 0; i < enemyRead.length; i++) {
        // body hitbox attachment
        gameState.zombieBody.children.entries[i].x = enemyRead[i].x - 10
        gameState.zombieBody.children.entries[i].y = enemyRead[i].y -10
        // head hitbox attachment
        gameState.zombieHead.children.entries[i].x = enemyRead[i].x - 10
        gameState.zombieHead.children.entries[i].y = enemyRead[i].y - 60
        // deactivate enemies
        if(enemyRead[i].active == false){
            enemyRead[i].x = -500
            enemyRead[i].enable = false
            enemyRead[i].embedded = false
            enemyRead[i].visible = false
        }
        if(enemyRead[i].x > gameState.hero.x){
            enemyRead[i].x -= enemyRead[i].speed
            enemyRead[i].play('zombieLeft', true)
        }
        if(enemyRead[i].x < gameState.hero.x){
            enemyRead[i].x += enemyRead[i].speed
            enemyRead[i].play('zombieRight', true)
        }
        if(enemyRead[i].y > gameState.hero.y){
            enemyRead[i].y -= enemyRead[i].speed
        }
        if(enemyRead[i].y < gameState.hero.y){
            enemyRead[i].y += enemyRead[i].speed
        }

        if(gameState.hero.y > enemyRead[i].y){
            gameState.hero.setDepth(10)
            gameState.weapon.setDepth(11)
            gameState.heroArm.setDepth(12)
            enemyRead[i].setDepth(1)
        }
        if(gameState.hero.y < enemyRead[i].y){
            gameState.hero.setDepth(1)
            gameState.weapon.setDepth(2)
            gameState.heroArm.setDepth(3)
            enemyRead[i].setDepth(10)
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