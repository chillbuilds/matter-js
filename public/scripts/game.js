
let gameState = {}
let gameDims = {width: 1200, height: 600}

function randNum(min, max) { 
    return Math.random() * (max - min) + min
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
    this.load.image('30-06', '../images/sprites/weapons/bullets/30-06.png')
    this.load.image('22', '../images/sprites/weapons/bullets/22.png')
    this.load.image('shotgunShell', '../images/sprites/weapons/bullets/shotgunShell.png')
    this.load.image('hitBox', '../images/sprites/hitbox.png')

    this.load.audio('kiss', '../audio/kiss.wav')
    this.load.audio('gasp', '../audio/gasp.wav')
}
   
function create() {
    gameState.toggleCooldown = false
    gameState.reloadCooldown = false
    gameState.weaponCooldown = false
    gameState.weaponPressed = false

    // hud
    gameState.ammo = {}
    gameState.ammo.thirtyOughtSix = this.add.group({
        key: '30-06',
        repeat: 60,
        setXY: {x: -500, y: -500}
    })
    gameState.ammo.thirtyOughtSix.children.iterateLocal('setScale', 0.7)
    gameState.ammo.thirtyOughtSix.setDepth(900)
    gameState.ammo.twentyTwo = this.add.group({
        key: '22',
        repeat: 60,
        setXY: {x: -500, y: -500}
    })
    gameState.ammo.twentyTwo.children.iterateLocal('setScale', 0.7)
    gameState.ammo.twentyTwo.setDepth(900)
    gameState.ammo.shotgunShell = this.add.group({
        key: 'shotgunShell',
        repeat: 60,
        setXY: {x: -500, y: -500}
    })
    gameState.ammo.shotgunShell.children.iterateLocal('setScale', 0.7)
    gameState.ammo.shotgunShell.setDepth(900)

    gameState.headshotText = this.add.text(-500, -500, '130')
    gameState.headshotText.setDepth(500)
    gameState.bodyshotText = this.add.text(-500, -500, '60')
    gameState.bodyshotText.setDepth(500)
    this.add.text(50, 50, 'move player: wasd').setDepth(500)
    this.add.text(50, 75, 'change weapon: shift').setDepth(500)
    this.add.text(50, 100, 'reload: r').setDepth(500)
    this.add.rectangle(40, 40, 260, 90, 0x0000, 0.75).setDepth(400).setOrigin(0)

    // audio setup
    gameState.audio = {}
    gameState.audio.kiss = this.sound.add('kiss').setVolume(0.05)
    gameState.audio.gasp = this.sound.add('gasp')

    // keyboard setup
    gameState.changeWeapon = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    gameState.reload = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    gameState.moveUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    gameState.moveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    gameState.moveDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    gameState.moveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    gameState.cursors = this.input.keyboard.createCursorKeys()

    // background setup
    gameState.bg = this.add.image(gameDims.width/2, gameDims.height/2, 'bg').setDepth(-1)

    gameState.muzzFlash = this.add.sprite(-500, -500, 'muzzFlash')
    gameState.muzzFlash.setScale(.05)
    gameState.muzzFlash.setAlpha(.8)

    gameState.hitEffect = this.add.rectangle(gameDims.width/2, gameDims.height/2, gameDims.width, gameDims.height, 0xBF1363, 0.4)
    gameState.hitEffect.setDepth(1000)
    gameState.hitEffect.setAlpha(0)

    // hero setup
    gameState.hero = this.physics.add.sprite(600, 450, 'hero')
    gameState.hero.setSize(25, 15, true)
    gameState.hero.health = 100
    gameState.hero.points = 0

    gameState.heroArm = this.add.sprite(-500, -500, 'arm')

    // weapon offsets: [weaponLeftX, weaponLeftY, weaponRightX, weaponRightY, bulletLeftX, bulletLeftY, bulletRightX, bulletRightY]
    gameState.weapon = {}
    gameState.weapon.nambu = this.add.sprite(-500, -500, 'nambu')
    gameState.weapon.nambu.setScale(0.3)
    gameState.weapon.nambu.offset = [-.7, .6, -.7, .25]
    gameState.weapon.nambu.damage = 30
    gameState.weapon.nambu.magCapacity = 8
    gameState.weapon.nambu.ammoCapacity = 80
    gameState.weapon.nambu.mag = gameState.weapon.nambu.magCapacity
    gameState.weapon.nambu.ammo = gameState.weapon.nambu.ammoCapacity + gameState.weapon.nambu.magCapacity
    gameState.weapon.nambu.ammoType = gameState.ammo.twentyTwo
    gameState.weapon.nambu.fireRate = 20
    gameState.weapon.nambu.reloadSpeed = 1700
    gameState.weapon.nambu.reloadEmptySpeed = 2500

    gameState.weapon.m1 = this.add.sprite(-500, -500, 'm1')
    gameState.weapon.m1.setScale(0.35)
    gameState.weapon.m1.offset = [-.15, .52, -.1, .3]
    gameState.weapon.m1.damage = 50
    gameState.weapon.m1.magCapacity = 8
    gameState.weapon.m1.ammoCapacity = 128
    gameState.weapon.m1.mag = gameState.weapon.m1.magCapacity
    gameState.weapon.m1.ammo = gameState.weapon.m1.ammoCapacity + gameState.weapon.m1.magCapacity
    gameState.weapon.m1.ammoType = gameState.ammo.thirtyOughtSix
    gameState.weapon.m1.fireRate = 28
    gameState.weapon.m1.reloadSpeed = 3400
    gameState.weapon.m1.reloadEmptySpeed = 1650

    gameState.weapon.raygun = this.add.sprite(-500, -500, 'raygun')
    gameState.weapon.raygun.setScale(0.25)
    gameState.weapon.raygun.offset = [-.38, .45, -.38, .45]
    gameState.weapon.raygun.damage = 90
    gameState.weapon.raygun.magCapacity = 8
    gameState.weapon.raygun.ammoCapacity = 80
    gameState.weapon.raygun.mag = gameState.weapon.raygun.magCapacity
    gameState.weapon.raygun.ammo = gameState.weapon.raygun.ammoCapacity + gameState.weapon.raygun.magCapacity
    gameState.weapon.raygun.fireRate = 32
    gameState.weapon.raygun.reloadSpeed = 1700
    gameState.weapon.raygun.reloadEmptySpeed = 2500

    gameState.weapon.sawedOff = this.add.sprite(-500, -500, 'sawedOff')
    gameState.weapon.sawedOff.setScale(0.35)
    gameState.weapon.sawedOff.offset = [0, .65, 0, .2]
    gameState.weapon.sawedOff.damage = 15*8
    gameState.weapon.sawedOff.magCapacity = 2
    gameState.weapon.sawedOff.ammoCapacity = 60
    gameState.weapon.sawedOff.mag = gameState.weapon.sawedOff.magCapacity
    gameState.weapon.sawedOff.ammo = gameState.weapon.sawedOff.ammoCapacity + gameState.weapon.sawedOff.magCapacity
    gameState.weapon.sawedOff.ammoType = gameState.ammo.shotgunShell
    gameState.weapon.sawedOff.fireRate = 40
    gameState.weapon.sawedOff.reloadSpeed = 2650
    gameState.weapon.sawedOff.reloadEmptySpeed = gameState.weapon.sawedOff.reloadSpeed

    gameState.hero.activeWeapon = gameState.weapon.m1
    gameState.hero.inactiveWeapon = gameState.weapon.sawedOff

    gameState.zombies = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        // repeat: 11,
        speed: 1.5,
    })
    gameState.zombiesDead = this.add.group({
        key: 'zombie',
        frame: 0,
        repeat: gameState.zombies.children.entries.length-1,
        setXY: {x: -500, y: -500}
    })
    gameState.bullethitBoxes = this.physics.add.group({
        key: 'bullet',
        repeat: 39,
        setScale: {x: 0.1, y: 0.1},
        setXY: {X: -500, y: -500}
    })
    gameState.bullethitBoxes.setAlpha(0)
    gameState.hero.bulletCount = gameState.bullethitBoxes.children.entries.length-1
    gameState.bulletVelocity = 2500
    
    gameState.bullethitBoxes.children.iterateLocal('setImmovable', true)
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
            _bullet.x = -500
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

}

function update() {

    // hud
    // console.log('mag capacity: ' + gameState.hero.activeWeapon.magCapacity)
    // console.log('ammo capacity: ' + gameState.hero.activeWeapon.ammoCapacity)
    // console.log('mag: ' + gameState.hero.activeWeapon.mag)
    // console.log('ammo: ' + gameState.hero.activeWeapon.ammo)
    // console.log(gameState.hero.activeWeapon.ammoType)
    // for(var i = 0; i < gameState.hero.activeWeapon.mag; i++){}

    // reload mid mag
    if(gameState.reload.isDown && gameState.hero.activeWeapon.mag > 0 && gameState.reloadCooldown == false){
        gameState.reloadCooldown = true
        setTimeout(()=>{
            if(gameState.reloadCooldown == true){
            gameState.hero.activeWeapon.mag = gameState.hero.activeWeapon.magCapacity
            gameState.hero.activeWeapon.ammo -= gameState.hero.activeWeapon.magCapacity
            gameState.reloadCooldown = false
            console.log('mag: ' + gameState.hero.activeWeapon.mag)
            console.log('ammo: ' + gameState.hero.activeWeapon.ammo)
            }
        }, gameState.hero.activeWeapon.reloadSpeed)
    }
    // reload empty
    if(gameState.hero.activeWeapon.mag <= 0){
        if(gameState.reload.isDown && gameState.hero.activeWeapon.ammo > gameState.hero.activeWeapon.magCapacity && gameState.reloadCooldown == false){
            gameState.reloadCooldown = true
            setTimeout(()=>{
                if(gameState.reloadCooldown == true){
                gameState.hero.activeWeapon.mag = gameState.hero.activeWeapon.magCapacity
                gameState.hero.activeWeapon.ammo -= gameState.hero.activeWeapon.magCapacity
                gameState.reloadCooldown = false
                console.log('mag: ' + gameState.hero.activeWeapon.mag)
                console.log('ammo: ' + gameState.hero.activeWeapon.ammo)
                }
            }, gameState.hero.activeWeapon.reloadEmptySpeed)}
        console.log('reload')
    }

    // recycle bullethitBoxes
    for(var i = 0; i < gameState.bullethitBoxes.children.entries.length; i++){
        if(gameState.bullethitBoxes.children.entries[i].x < - 200 ||
           gameState.bullethitBoxes.children.entries[i].x > + gameDims.width + 200 || 
           gameState.bullethitBoxes.children.entries[i].y < - 200 ||
           gameState.bullethitBoxes.children.entries[i].y > + gameDims.height + 200){
            gameState.bullethitBoxes.children.entries[i].setVelocity(0)
            gameState.bullethitBoxes.children.entries[i].x = -500
        }
    }

    let leftClick = this.input.activePointer
    if(leftClick.isDown == false){
        gameState.weaponPressed = false}
    if(leftClick.isDown && gameState.weaponCooldown == false && gameState.weaponPressed == false && gameState.hero.activeWeapon.mag > 0 && gameState.reloadCooldown == false){
        // decriment weapon magazine
        gameState.hero.activeWeapon.mag -= 1
        console.log('mag:' + gameState.hero.activeWeapon.mag)

        if(gameState.hero.bulletCount < 0){
            gameState.hero.bulletCount = gameState.bullethitBoxes.children.entries.length-1
        }

        gameState.weaponPressed = true
        gameState.weaponCooldown = true

        let bullethitBox = gameState.bullethitBoxes.children.entries[gameState.hero.bulletCount]
        bullethitBox.x = gameState.hero.x
        bullethitBox.y = gameState.hero.y

        this.physics.moveTo(bullethitBox, game.input.mousePointer.x, game.input.mousePointer.y, gameState.bulletVelocity)

        gameState.hero.bulletCount -= 1

        gameState.audio.kiss.play()
        console.log('shots fired')

        setTimeout(()=>{gameState.weaponCooldown = false}, gameState.hero.activeWeapon.fireRate*10)
    }

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
        gameState.reloadCooldown = false
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
            // debug: true
            debug: false
        }
    },
    parent: 'canvasContainer',
    scene: {
        preload,
        create,
        update
    }
  }
  
  const game = new Phaser.Game(config)