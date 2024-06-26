class GameMap {
    constructor(xAxis, yAxis, ctx, sectionIndex) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.collisionBlocks = [];
        this.enemies = [];
        this.ctx = ctx;
        this.sectionIndex = sectionIndex;
        this.playerReSpawnPosition = {
            x: 0,
            y: 0,
        }
        this.section = MAP_SECTION_ARRAY[this.sectionIndex];
        this.turrets = [];
        this.tanks = [];
        this.tempEnemies = [];
        this.powerupBlock;
        this.canSpawnTank = difficulty == DIFFICULTY_EASY ? false : Math.round(generateRandomNumber(1, 5)) <= 4;
    }
    draw() {
        const background = new Image();
        const { x, y, width, height } = mapBackgroundSprite[this.section];

        background.src = './assets/images/NES - Contra - Level 1.png';
        background.onload = () => {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.ctx.drawImage(background, x, y, width, height, this.xAxis, this.yAxis, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }
    createBlocksArray() {
        mapSection[this.section].forEach((row, y) => {
            row.forEach((element, x) => {
                const positionX = x * TILE_SIZE;
                const positionY = y * TILE_SIZE;

                switch (element) {
                    case PLATFORM_ID:
                        this.createCollisionBlock(positionX, positionY, COLLISION_PLATFORM);
                        break;
                    case PLAYER_RESPAWN_COORDS_ID:
                        this.setPlayerReSpawnPosition(positionX, positionY);
                        break;
                    case WATER_ID:
                        this.createCollisionBlock(positionX, positionY, COLLISION_WATER);
                        break;
                    case DEATH_DROP_ID:
                        this.createCollisionBlock(positionX, positionY, DEATH_DROP_ID);
                        break;
                    case POWERUP_BLOCK:
                        this.createPowerupBlock(positionX, positionY);
                        break;
                    case ENEMY_RUNNING:
                        this.spawnRunningEnemy(positionX, positionY);
                        break;
                    case ENEMY_SOLDIER:
                        this.spawnSoldierEnemy(positionX, positionY);
                        break;
                    case ENEMY_TURRET:
                        this.spawnTurret(positionX, positionY);
                        break;
                    case ENEMY_TANK:
                        this.spawnTankEnemy(positionX, positionY);
                        break;
                    case ENEMY_OPTIONAL:
                        this.spawnOptionalEnemy(positionX, positionY);
                        break;
                }
            });
        });
    }
    createCollisionBlock(xAxis, yAxis, type) {
        this.collisionBlocks.push(new CollisionBlock(xAxis, yAxis, type));
    }

    spawnRunningEnemy(x, y) {
        let spawnLimit = 3; // The maximum number of enemies to spawn
        let spawnInterval = 1750; // The time interval between each enemy spawn
        if (difficulty != DIFFICULTY_EASY) {
            spawnLimit = generateRandomNumber(4, 7);
            const randomInterval = generateRandomNumber(1000, 2500);
            spawnInterval = randomInterval;
        }

        for (let i = 0; i < spawnLimit; i++) {
            setTimeout(() => {
                const enemy = new RunningEnemy(x, y, this.collisionBlocks);
                this.enemies.push(enemy);
            }, i * spawnInterval);
        }
    }
    spawnSoldierEnemy(x, y) {
        const enemy = new SoldierEnemy(x, y, this.collisionBlocks);
        this.enemies.push(enemy);
    }

    spawnTurret(x, y) {
        const turret = new Turret(x, y);
        this.turrets.push(turret);
    }

    setPlayerReSpawnPosition(x, y) {
        this.playerReSpawnPosition.x = x;
        this.playerReSpawnPosition.y = y;
    }
    getPlayerReSpawnPosition() {
        return this.playerReSpawnPosition;
    }

    createPowerupBlock(x, y) {
        this.powerupBlock = new PowerupBlock(x, y, mapIndex);
    }
    spawnTankEnemy(x, y) {
        const tank = new Tank(x, y);
        if (this.canSpawnTank) this.tanks.push(tank);
    }

    spawnOptionalEnemy(x, y) {
        if (difficulty == DIFFICULTY_EASY || !this.canSpawnTank) {
            this.spawnSoldierEnemy(x, y);
        }
    }
}