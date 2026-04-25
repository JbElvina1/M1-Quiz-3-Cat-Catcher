const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#87ceeb",

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

let player;
let cursors;
let cats;
let ground;
let score = 0;
let scoreText;
let gameOver = false;

new Phaser.Game(config);

function preload() {
    this.load.image("bg", "assets/BG.png");
    this.load.image("mainGround", "assets/SandGround.png");

    this.load.spritesheet("player", "assets/Character.png", {
        frameWidth: 64,
        frameHeight: 64
    });

    this.load.image("cat", "assets/C.png");
}

function create() {

    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    ground = this.physics.add.staticGroup();

    const base = ground.create(400, 580, "mainGround");
    base.setScale(800 / base.width, 100 / base.height);
    base.refreshBody();

    base.body.setSize(base.displayWidth, 30);
    base.body.setOffset(0, base.displayHeight - 80);

    player = this.physics.add.sprite(400, 520, "player");

    player.setScale(1);
    player.setCollideWorldBounds(true);
    player.setSize(80, 180);
    player.setOffset(30, -50);

    player.body.setGravityY(900);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("player", { start: 10, end: 10 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    player.play("idle");

    cats = this.physics.add.group();

    spawnCat(this);

    this.physics.add.overlap(player, cats, catchCat, null, this);

    scoreText = this.add.text(20, 20, "Cats Collected: 0", {
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold"
    });
}

function update() {

    if (gameOver) return;

    let speed = 300;

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true);
        player.play("run", true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false);
        player.play("run", true);
    }
    else {
        player.setVelocityX(0);
        player.play("idle", true);
    }

    cats.children.iterate(cat => {
        if (cat && cat.y > 600) {
            cat.destroy();
            spawnCat(this);
        }
    });
}

function spawnCat(scene) {
    const x = Phaser.Math.Between(50, 750);
    const cat = cats.create(x, 0, "cat");

    cat.setScale(0.15);
    cat.setVelocityY(200);
}

function catchCat(player, cat) {

    cat.destroy();
    score++;
    scoreText.setText("Cats Collected: " + score);

    console.log("Cat Caught!");

    if (score >= 10) {
        sceneWin(this);
        return;
    }

    spawnCat(this);
}

function sceneWin(scene) {
    gameOver = true;

    scene.physics.pause();

    scene.add.text(30, 250, "CONGRATULATIONS YOU WIN!", {
        fontSize: "48px",
        color: "#00aa00",
        fontStyle: "bold"
    });
}