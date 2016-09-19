
class Game {
    constructor(canvasWidth, canvasHeight) {
        this._ready = false;
        //staticObjects do not move and thus do not require an update() call
        this.staticObjects = [];
        //gameObjects are objects which move and/or are interactive
        this.gameObjects = {};
        this.gameObjects.balls = [];
        this.player = {};
        //values needed for keeping track of time
        this._accumulator = 0;
        let lastTime;
        this.step = 1 / 360;

        //used to handle update cycles
        const callback = time => {
            if (lastTime && this._ready) {
                this.update((time - lastTime) / 1000);
            }
            lastTime = time;
            requestAnimationFrame(callback);
        }
        callback();
    }

    start() {
        this._ready = true;
        //background
        this.staticObjects.push(new Background("assets/images/background1.jpg"));
        //Side borders
        this.staticObjects.push(new Border(-25, -25, 25, stage.height + 50));//left
        this.staticObjects.push(new Border(stage.width, -25, 25, stage.height + 50)); //right
        this.staticObjects.push(new Border(-25, -25, stage.width + 50, 25)); //top
        this.staticObjects.push(new Border(-25, stage.height, stage.width + 50, 25));
        this.staticObjects.forEach(obj => stage.addChild(obj));
        //First ball
        this.gameObjects.balls.push(new Ball(stage.width / 2, 100));
        this.gameObjects.balls.forEach(obj => stage.addChild(obj));
        //Player paddle
        this.player = new Paddle();
        stage.addChild(this.player);
    }

    checkCollision(first, second) {
        let vectorX = (first.x + (first.width / 2)) - (second.x + (second.width / 2)),
            vectorY = (first.y + (first.height / 2)) - (second.y + (second.height / 2)),
            halfWidths = (first.width / 2) + (second.width / 2),
            halfHeights = (first.height / 2) + (second.height / 2),
            direction = null;

        if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) { //if is colliding
            let offsetX = halfWidths - Math.abs(vectorX),
                offsetY = halfHeights - Math.abs(vectorY);
            //Figure the direction of the collision, and then adjust shapes as to not penetrate each other
            if (offsetX >= offsetY) {
                if (vectorY > 0) {
                    direction = Direction.TOP;
                    first.y += offsetY;
                } else {
                    direction = Direction.BOTTOM;
                    first.y -= offsetY;
                }
            } else {
                if (vectorX > 0) {
                    direction = Direction.LEFT;
                    first.x += offsetX;
                } else {
                    direction = Direction.RIGHT;
                    first.x -= offsetX;
                }
            }
        }
        if (first.collide && direction != null) {
            first.collide(direction, second);
        }
        return direction;
    }

    draw() {
        stage.update();
    }

    simulate(deltaTime) {
        let _this = this;
        this.gameObjects.balls.forEach(ball => ball.update(deltaTime));
        this.gameObjects.balls.forEach(function (ball) {
            _this.staticObjects.forEach(staticobj => _this.checkCollision(ball, staticobj));
            _this.checkCollision(ball, _this.player);
        });
    }

    update(deltaTime) {
        this._accumulator += deltaTime;
        while (this._accumulator > this.step) {
            this.simulate(this.step);
            this._accumulator -= this.step;
        }
        this.draw();
    }

    addBall(x, y) {
        let ball = new Ball(x, y);
        console.log(`ball coords: x ${ball.x} y ${ball.y}`);
        this.gameObjects.balls.push(ball);
        stage.addChild(ball);
    }
}
let stage = new Stage(800, 600, "gameCanvas");
stage.on("click", function (e) {
    if (game._ready) {
        game.addBall(e.stageX, e.stageY);
        console.log(e);
        console.log(`CRICK! x ${e.stageX}, y ${e.stageY}`);
    }
});
stage.on("stagemousemove", function (e) {
    if (game._ready) game.player.movePaddle(e.stageX);
});
let game = new Game();
