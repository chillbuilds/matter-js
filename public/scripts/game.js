let gameState = {}
let gameDims = {width: 1200, height: 600}

function randNum(max) {
    return Math.floor(Math.random()*max)
}

function preload() {
    this.load.spritesheet('zombie', '../images/sprites/zombie.png', { frameWidth: 48, frameHeight: 60 })
    this.load.image('bg', '../images/sprites/bg.jpeg')
}
   
function create() {
    gameState.cursors = this.input.keyboard.createCursorKeys()
    gameState.bg = this.add.image(600, 320, 'bg')
    gameState.bg.setScale(2.075)

    gameState.hero = this.physics.add.sprite(randNum(gameDims.width), (randNum(gameDims.height)/2)+(gameDims.height/2), 'zombie')
    gameState.hero.setScale(2.5)
    gameState.hero.setSize(25, 45, true)

    gameState.zombies = this.physics.add.group({
        key: 'zombie',
        frame: 0,
        repeat: 10,
        setXY: { x: -500, y: -500},
        setScale: {x: 2.5, y: 2.5}
    })
    console.log(gameState.zombies)
    // gameState.zombies = this.physics.add.sprite(randNum(gameDims.width)/2+gameDims.width/2, (randNum(gameDims.height)/2)+(gameDims.height/2), 'zombie')
    // gameState.zombies.setScale(2.5)
    // gameState.zombies.setSize(25, 45, true)

    this.anims.create({
        key: 'spawn',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [0, 1, 2, 3, 4] }),
        frameRate: 8,
        repeat: 0
    })
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [5, 6, 7] }),
        frameRate: 8,
        repeat: -1
    })
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('zombie', { frames: [8, 9, 10] }),
        frameRate: 8,
        repeat: -1
    })
    this.physics.add.collider(gameState.zombies, gameState.hero, function (zombie, hero) {
        console.log('collision hath bean detecteth')
    })
    // this.physics.add.collider(
    //     gameState.zombies,
    //     gameState.hero,
    //     function (_zombie, _hero)
    //     {   
    //         console.log('collision detected, mufucka')
    //         console.log('x: ' + _zombie.x)
    //         console.log('y: ' + _zombie.y)
    //         _zombie.x = 1300
    //         _zombie.y = 500
    //     })
    gameState.hero.play('spawn')
    
}

function update() {
    // if(gameState.zombie.x > gameState.hero.x){
    //     gameState.zombie.x -= 2
    //     gameState.zombie.play('left', true)
    // }
    // if(gameState.zombie.x < gameState.hero.x){
    //     gameState.zombie.x += 2
    //     gameState.zombie.play('right', true)
    // }
    // if(gameState.zombie.y > gameState.hero.y){
    //     gameState.zombie.y -= 1
    //     gameState.zombie.play('left', true)
    // }
    // if(gameState.zombie.y < gameState.hero.y){
    //     gameState.zombie.y += 1
    //     gameState.zombie.play('left', true)
    // }
}

function spawnZombie() {

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
    scene: {
        preload,
        create,
        update
    }
  };
  
  const game = new Phaser.Game(config)