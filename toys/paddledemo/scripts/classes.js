let Direction = {
    "TOP": 0,
    "RIGHT": 1,
    "BOTTOM": 2,
    "LEFT": 3
}

let constants = {
    physics: {
        defaultGravity: 1500,
    },
    ball: {
        xBiasMultiplier: 3.5,
    },
    paddle: {
        heightFromBottom: 40,
    }
}

class Stage extends createjs.Stage {
    constructor(canvasWidth, canvasHeight, canvasId) {
        super(canvasId);
        this.width = canvasWidth;
        this.height = canvasHeight;
    }

    get top() { return -this.height / 2; }
    get bottom() { return this.height / 2; }
    get left() { return -this.width / 2; }
    get right() { return this.width / 2; }
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class ShapeGameObject extends createjs.Shape {
    constructor(startX, startY, width, height, moveable = true, gravity = 1750) {
        super();
        this.width = width;
        this.height = height;
        this.vel = new Vector();
        this.moveable = moveable;
        this.gravity = gravity;
        this.x = startX;
        this.y = startY;
    }

    get left() { return this.x - (this.width / 2); }
    get right() { return this.x + (this.width / 2); }
    get top() { return this.y - (this.height / 2); }
    get bottom() { return this.y + (this.height / 2); }
    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; }

    update(deltaTime) {
        if (this.moveable) {
            this.vel.y += this.gravity * deltaTime;
            this.x += this.vel.x * deltaTime;
            this.y += this.vel.y * deltaTime;
        }
    }
}

class GameObject extends createjs.Bitmap {
    constructor(startX, startY, assetid, moveable = true, gravity = constants.physics.defaultGravity) {
        super(assets.getResult(assetid));
        console.log(super.getBounds());
        this.width = super.getBounds().width;
        this.height = super.getBounds().height;
        this.vel = new Vector();
        this.moveable = moveable;
        this.gravity = gravity;
        this.x = startX;
        this.y = startY;
    }

    get left() { return this.x - (this.width / 2); }
    get right() { return this.x + (this.width / 2); }
    get top() { return this.y - (this.height / 2); }
    get bottom() { return this.y + (this.height / 2); }
    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; }
    update(deltaTime) {
        if (this.moveable) {
            this.vel.y += this.gravity * deltaTime;
            this.x += this.vel.x * deltaTime;
            this.y += this.vel.y * deltaTime;
        }
    }
}

class Background extends createjs.Bitmap {
    constructor(bgstring) {
        super(bgstring);
    }
}

class Ball extends GameObject {
    constructor(startX, startY) {
        super(startX, startY, "image_ball");
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    collide(direction, obj) {
        console.log(`COLLISION!! DIRECTION: ${direction}`);
        if (direction == null || obj == null) {
            return;
        }
        else if (direction === Direction.TOP || direction === Direction.BOTTOM) {
            this.vel.y = -this.vel.y;
        }
        else {
            this.vel.x = - this.vel.x;
        }
        if (obj instanceof Paddle) {
            console.log("COLLIDE WITH PADDLE!");
            let diffX = this.center.x - obj.center.x;
            this.vel.x = diffX * constants.ball.xBiasMultiplier;
        }
    }
}

class Paddle extends GameObject {
    constructor() {
        super(stage.width / 2, stage.height - constants.paddle.heightFromBottom, "image_paddle", false, 0);
    }
    update() {
        return;
    }
    movePaddle(x) {
        this.x = x - (this.width / 2);
    }
}

class Border extends ShapeGameObject {
    constructor(startX, startY, width, height) {
        super(startX, startY, width, height, false, 0);
        this.graphics.beginFill("Blue").drawRect(0, 0, this.width, this.height);
    }
}
