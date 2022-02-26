
let gameState = {}
let gameDims = {width: 1200, height: 600}

function randNum(min, max) { 
    return Math.random() * (max - min) + min;
} 

function preload() {
    this.load.spritesheet('zombie', '../images/sprites/zombie.png', { frameWidth: 192, frameHeight: 240 })
    this.load.spritesheet('hero', '../images/sprites/julie.png', { frameWidth: 192, frameHeight: 240})
    this.load.image('arm', '../images/sprites/arm.png')
    this.load.image('bullet', '../images/sprites/weapons/bullet.png')
    this.load.image('bg', '../images/sprites/background.png')
    this.load.image('muzzFlash', '../images/sprites/muzzFlash.png')
    this.load.image('nambu', '../images/sprites/weapons/nambu.png')
    this.load.image('m1', '../images/sprites/weapons/m1.png')
    this.load.image('raygun', '../images/sprites/weapons/raygun.png')
    this.load.image('sawedOff', '../images/sprites/weapons/sawedOff.png')
    this.load.image('hitBox', '../images/sprites/hitbox.png')

    this.load.audio('kiss', '../audio/kiss.wav')
    this.load.audio('gasp', '../audio/gasp.wav')
}
   
function create() {
    gameState.toggleCooldown = false

    gameState.headshotText = this.add.text(-500, -500, '130')
    gameState.headshotText.setDepth(500)
    gameState.bodyshotText = this.add.text(-500, -500, '60')
    gameState.bodyshotText.setDepth(500)
    gameState.movementKeys = this.add.text(50, 50, 'move player: wasd')
    gameState.movementKeys.setDepth(500)
    gameState.weaponKey = this.add.text(50, 75, 'change weapon: caps lock')
    gameState.weaponKey.setDepth(500)
    gameState.reloadKey = this.add.text(50, 100, 'reload: r')
    gameState.reloadKey.setDepth(500)
    this.add.rectangle(40, 40, 260, 90, 0x0000, 0.5).setDepth(400).setOrigin(0)

    // audio setup
    const kiss = this.sound.add('kiss')
    const gasp = this.sound.add('gasp')

    // keyboard setup
    gameState.changeWeapon = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CAPS_LOCK)
    gameState.reload = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    gameState.moveUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    gameState.moveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    gameState.moveDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    gameState.moveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
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
    gameState.hero.points = 0

    gameState.heroArm = this.add.sprite(-500, -500, 'arm')

    // weapon offsets: [weaponLeftX, weaponLeftY, weaponRightX, weaponRightY, bulletLeftX, bulletLeftY, bulletRightX, bulletRightY]
    gameState.weapon = {}
    gameState.weapon.nambu = this.add.sprite(-500, -500, 'nambu')
    gameState.weapon.nambu.setScale(0.3)
    gameState.weapon.nambu.offset = [-.7, .6, -.7, .25, -4.8, -.35, -5.3, 1.2]
    gameState.weapon.nambu.damage = 30
    gameState.weapon.nambu.magCapacity = 8
    gameState.weapon.nambu.ammoCapacity = 80
    gameState.weapon.nambu.mag = gameState.weapon.nambu.magCapacity
    gameState.weapon.nambu.ammo = gameState.weapon.nambu.ammoCapacity + gameState.weapon.nambu.magCapacity
    gameState.weapon.nambu.fireRate = 1200
    gameState.weapon.nambu.reloadSpeed = 1.7
    gameState.weapon.nambu.reloadEmptySpeed = 2.5

    gameState.weapon.m1 = this.add.sprite(-500, -500, 'm1')
    gameState.weapon.m1.setScale(0.35)
    gameState.weapon.m1.offset = [-.15, .52, -.1, .3, -5.3, -.1, -5.3, .85]
    gameState.weapon.m1.magCapacity = 8
    gameState.weapon.m1.ammoCapacity = 80
    gameState.weapon.m1.mag = gameState.weapon.m1.magCapacity
    gameState.weapon.m1.ammo = gameState.weapon.m1.ammoCapacity + gameState.weapon.m1.magCapacity
    gameState.weapon.m1.fireRate = 1200
    gameState.weapon.m1.reloadSpeed = 1.7
    gameState.weapon.m1.reloadEmptySpeed = 2.5

    gameState.weapon.raygun = this.add.sprite(-500, -500, 'raygun')
    gameState.weapon.raygun.setScale(0.25)
    gameState.weapon.raygun.offset = [-.38, .45, -.38, .45, -4, -.2, -4, 1]
    gameState.weapon.raygun.damage = 70
    gameState.weapon.raygun.magCapacity = 8
    gameState.weapon.raygun.ammoCapacity = 80
    gameState.weapon.raygun.mag = gameState.weapon.raygun.magCapacity
    gameState.weapon.raygun.ammo = gameState.weapon.raygun.ammoCapacity + gameState.weapon.raygun.magCapacity
    gameState.weapon.raygun.fireRate = 1200
    gameState.weapon.raygun.reloadSpeed = 1.7
    gameState.weapon.raygun.reloadEmptySpeed = 2.5

    gameState.weapon.sawedOff = this.add.sprite(-500, -500, 'sawedOff')
    gameState.weapon.sawedOff.setScale(0.35)
    gameState.weapon.sawedOff.offset = [0, .65, 0, .2, -4.8, 0, -4.8, .8]
    gameState.weapon.sawedOff.damage = 45*2
    gameState.weapon.sawedOff.magCapacity = 8
    gameState.weapon.sawedOff.ammoCapacity = 80
    gameState.weapon.sawedOff.mag = gameState.weapon.sawedOff.magCapacity
    gameState.weapon.sawedOff.ammo = gameState.weapon.sawedOff.ammoCapacity + gameState.weapon.sawedOff.magCapacity
    gameState.weapon.sawedOff.fireRate = 1200
    gameState.weapon.sawedOff.reloadSpeed = 1.7
    gameState.weapon.sawedOff.reloadEmptySpeed = 2.5

    gameState.hero.activeWeapon = gameState.weapon.m1
    gameState.hero.inactiveWeapon = gameState.weapon.nambu

    gameState.zombies = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        repeat: 11,
        speed: 1.5,
    })
    gameState.zombiesDead = this.add.group({
        key: 'zombie',
        frame: 0,
        repeat: gameState.zombies.children.entries.length-1,
        setXY: {x: -500, y: -500},
        hideOnComplete: true
    })
    gameState.bullets = this.physics.add.group({
        key: 'bullet',
        repeat: 9,
        setScale: {x: 0.05, y: 0.05},
        setImmovable: true
    })
    gameState.bullethitBoxes = this.physics.add.group({
        key: 'bullet',
        repeat: 9,
        setScale: {x: 0.1, y: 0.1}
    })
    gameState.bullethitBoxes.setAlpha(0)
    gameState.hero.bulletCount = 0
    gameState.bulletVelocity = 2500
    

    gameState.zombies.children.iterateLocal('setSize', 25, 150)

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
        frames: this.anims.generateFrameNumbers('zombie', { frames: [11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 19, 20] }),
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
        if(_zombie.active == true){
        _hero.body.enable = false
        gameState.hitEffect.setAlpha(60)
        if(_hero.health <= 0){
            _hero.body.enable = false
        }
        setTimeout(()=>{gameState.hitEffect.setAlpha(0)}, 50)
        setTimeout(()=>{
            _hero.body.enable = true
            _hero.health -= 10
        console.log('health: ' + _hero.health)
        }, 500)
        console.log('x: ' + gameState.hero.x)
        }
    })

    this.physics.add.collider(gameState.zombies, gameState.bullethitBoxes, function (_zombie, _bullet) {
        if(_zombie.active == true){
        if(_zombie.y - _bullet.y > 30){
            // headshot
            gameState.hero.points += 130
            gameState.headshotText.x = _zombie.x
            gameState.headshotText.y = _zombie.y - (_zombie.y - _bullet.y)
            _zombie.health -= 100
            setTimeout(()=>{gameState.headshotText.x = -500}, 150)
        }else{
            // bodyshot
            gameState.hero.points += 60
            gameState.bodyshotText.x = _zombie.x
            gameState.bodyshotText.y = _zombie.y - (_zombie.y - _bullet.y)
            _zombie.health -= 18
            setTimeout(()=>{gameState.bodyshotText.x = -500}, 150)
        }
        console.log('zombie health:' + _zombie.health)
        console.log('points: ' + gameState.hero.points)
        if(_zombie.health <= 0){
            _zombie.active = false
        }
        // /remove bullet from frame
        _bullet.setVelocity(0)
        _bullet.x = -200
        gameState.bullets.children.entries[gameState.hero.bulletCount].setVelocity(0)
        gameState.bullets.children.entries[gameState.hero.bulletCount].x = -200
        }
    })

    this.physics.add.collider(gameState.zombies, gameState.zombies, function (_zombie1, _zombie2) {
        if(_zombie1.active == true && _zombie2.active == true)
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

    let enemySetup = gameState.zombies.getChildren()
    for(var i = 0; i < enemySetup.length; i++) {
        enemySetup[i].x = randNum(-50, -200)
        enemySetup[i].y = randNum(gameDims.height/2, gameDims.height)
        enemySetup[i].speed = randNum(.5, 1.5)
        enemySetup[i].active = true
        enemySetup[i].health = 50
        enemySetup[i].body.setImmovable(true)
    }

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
        
        let bullet = gameState.bullets.children.entries[gameState.hero.bulletCount]
        let bullethitBox = gameState.bullethitBoxes.children.entries[gameState.hero.bulletCount]
        // bullet offset
        if(gameState.hero.facing == 'left'){
            bullet.setOrigin(gameState.hero.activeWeapon.offset[4], gameState.hero.activeWeapon.offset[5])
            }
        if(gameState.hero.facing == 'right'){
            bullet.setOrigin(gameState.hero.activeWeapon.offset[6], gameState.hero.activeWeapon.offset[7])
        }
        bullet.x = gameState.hero.activeWeapon.x
        bullet.y = gameState.hero.activeWeapon.y
        bullethitBox.x = gameState.hero.x
        bullethitBox.y = gameState.hero.y

        let bulletPhys = this.physics.moveTo(bullet, game.input.mousePointer.x, game.input.mousePointer.y, gameState.bulletVelocity)
        this.physics.moveTo(bullethitBox, game.input.mousePointer.x, game.input.mousePointer.y, gameState.bulletVelocity)

        bullet.rotation = bulletPhys
    }, this)

    // gameState.zombies.children.entries[0].play('zombieLeft')
    // gameState.zombies.children.entries[0].anims.stop()

}

function update() {

    

    if(gameState.moveUp.isUp && gameState.moveDown.isUp && gameState.moveLeft.isUp && gameState.moveRight.isUp)
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
        gameState.hero.activeWeapon.flipY = true
        gameState.hero.activeWeapon.setOrigin(gameState.hero.activeWeapon.offset[0], gameState.hero.activeWeapon.offset[1])
        gameState.hero.activeWeapon.x = gameState.hero.x + 6
        gameState.hero.activeWeapon.y = gameState.hero.y - 19
        gameState.hero.activeWeapon.rotation = (Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y))
    }
    if(gameState.hero.facing == 'right'){
        gameState.heroArm.flipX = true
        gameState.heroArm.flipY = false
        gameState.heroArm.x = gameState.hero.x - 6
        gameState.heroArm.y = gameState.hero.y - 19
        gameState.heroArm.setOrigin(0.1, 0.33)
        gameState.heroArm.rotation = Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y)
        gameState.hero.activeWeapon.flipY = false
        gameState.hero.activeWeapon.setOrigin(gameState.hero.activeWeapon.offset[2], gameState.hero.activeWeapon.offset[3])
        gameState.hero.activeWeapon.x = gameState.hero.x - 8
        gameState.hero.activeWeapon.y = gameState.hero.y - 24
        gameState.hero.activeWeapon.rotation = (Phaser.Math.Angle.Between(gameState.heroArm.x, gameState.heroArm.y, game.input.mousePointer.x, game.input.mousePointer.y))
    }

    //weapon toggle
    if(gameState.changeWeapon.isDown && gameState.toggleCooldown == false){
        gameState.toggleCooldown = true
        gameState.hero.weaponSwap = gameState.hero.inactiveWeapon
        gameState.hero.inactiveWeapon = gameState.hero.activeWeapon
        gameState.hero.activeWeapon = gameState.hero.weaponSwap
        gameState.hero.inactiveWeapon.x = -500
        setTimeout(()=>{gameState.toggleCooldown = false}, 500)
    }
    // hero movement and animation
    gameState.hero.setVelocity(0)
    if(gameState.moveLeft.isDown){
        gameState.hero.x -= 5}
    if(gameState.moveRight.isDown){
        gameState.hero.x += 5}
    if(gameState.moveUp.isDown){
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
    if(gameState.moveDown.isDown){
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
        // deactivate enemies
        if(enemyRead[i].active == false){
            gameState.zombiesDead.children.entries[i].x = enemyRead[i].x
            gameState.zombiesDead.children.entries[i].y = enemyRead[i].y
            gameState.zombiesDead.children.entries[i].play('zombieDie', true)
            enemyRead[i].setVelocity(0)
            enemyRead[i].body.enable = false
            enemyRead[i].visible = false
            moveTheDead(enemyRead[i], gameState.zombiesDead.children.entries[i])
        }
        // enemy movement
        if(enemyRead[i].x > gameState.hero.x && enemyRead[i].active == true){
            enemyRead[i].x -= enemyRead[i].speed
            enemyRead[i].play('zombieLeft', true)
        }
        if(enemyRead[i].x < gameState.hero.x && enemyRead[i].active == true){
            enemyRead[i].x += enemyRead[i].speed
            enemyRead[i].play('zombieRight', true)
        }
        if(enemyRead[i].y > gameState.hero.y && enemyRead[i].active == true){
            enemyRead[i].y -= enemyRead[i].speed
        }
        if(enemyRead[i].y < gameState.hero.y && enemyRead[i].active == true){
            enemyRead[i].y += enemyRead[i].speed
        }

        if(gameState.hero.y > enemyRead[i].y){
            gameState.hero.setDepth(10)
            gameState.hero.activeWeapon.setDepth(11)
            gameState.heroArm.setDepth(12)
            enemyRead[i].setDepth(1)
        }
        if(gameState.hero.y < enemyRead[i].y){
            gameState.hero.setDepth(1)
            gameState.hero.activeWeapon.setDepth(2)
            gameState.heroArm.setDepth(3)
            enemyRead[i].setDepth(10)
        }
    }
}

function moveTheDead(enemy, enemyDead) {
    setTimeout(()=>{
        enemy.x = -500
        enemyDead.x = -500
        enemyDead.anims.stop()
    }, 1100)
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