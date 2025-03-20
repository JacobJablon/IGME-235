// creates the main character for the different levels
class MainCharacter extends PIXI.Sprite {
    constructor(x = 100, y = 300) {
        super(app.loader.resources["images/mainCharacter.png"].texture);
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
    }
}

// creates the background image for the different levels
class Background extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/CastleEscapeBackground.png"].texture);
        this.x = x;
        this.y = y;
    }
}

// creates a button style that is used to create different buttons
class Button extends PIXI.Text {
    constructor(buttonName, fcnCall, x, y, size, lvl = 0, enabled = true) {
        super(buttonName);

        this.anchor.set(0.5, 0.5)
        this.x = x;
        this.y = y;
        this.lvl = lvl;
        this.enabled = enabled;

        let buttonStyle = new PIXI.TextStyle({
            fill: 0xCF0606,
            fontSize: size,
            fontFamily: "Alegreya",
            stroke: 0x000000,
            strokeThickness: 4
        });
        if (!this.enabled) {
            buttonStyle.fill = 0x757575;
            buttonStyle.stroke = 0x1F1F1F;
        }
        this.style = buttonStyle;

        if (this.enabled) {
            this.interactive = true;
            this.buttonMode = true;
            this.on('pointerup', () => currentLevel = this.lvl);
            this.on("pointerup", fcnCall);
            this.on('pointerover', e => e.target.alpha = 0.7);
            this.on('pointerout', e => e.currentTarget.alpha = 1.0);
        }
        
    }
}

// creates a text style that is used for each level's header title
class LevelHeader extends PIXI.Text {
    constructor(text) {
        super(text);

        let lvlHeader = new PIXI.TextStyle({
            fill: 0xDBA00B,
            fontSize: 30,
            fontFamily: "Algreya"
        });

        this.style = lvlHeader;
        this.anchor.set(0.5, 0.5);
        this.x = 500;
        this.y = 25;
    }
}

// creates the circle that the player moves their crosshair to to start each level
class StartLevelButton extends PIXI.Graphics {
    constructor(fcnCall) {
        super();
        this.beginFill(0xFFFFFF, 0.2);
        this.lineStyle(2, 0xDBA00B);
        this.drawCircle(0, 0, 50);
        this.endFill();
        this.x = 100;
        this.y = 300;
        this.radius = 50;

        this.interactive = true;
        this.buttonMode = true;
        this.on("pointerover", fcnCall);
    }
}

// creates the box that the player must reach to complete each level
class FinishLevelBox extends PIXI.Graphics {
    constructor() {
        super();
        this.beginFill(0x1EB323, 0.5);
        this.lineStyle(2, 0x1EB323, 1);
        this.drawRect(900, 275, 25, 50);
        this.endFill();
    }
}

// creates the zombies that move horizontally (left to right) (used in levels 1,3,4,5,6)
class HorizontalZombie extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/zombie.png"].texture);
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.speed = 200;
    }

    move(dt = 1 / 60) {
        this.x += this.speed * dt;
        if (this.x > 900) {
            this. x = 900;
            this.speed *= -1;
        }
        if (this.x < 100) {
            this.x = 100;
            this.speed *= -1;
        }
    }
}

// creates the zombies that move vertically (up and down) (used in levels 2,4,5)
class VericalZombie extends PIXI.Sprite {
    constructor(x = 0, y = 0, scale = 1) {
        if (currentLevel !== 6) {
            super(app.loader.resources["images/zombie.png"].texture);
        } else if (currentLevel == 6) {
            super(app.loader.resources["images/zombieBig.png"].texture);
        }
        
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.speed = 200;
        this.scale.set(scale);
    }

    move(dt = 1 / 60) {
        this.y += this.speed * dt;
        if (this.y > 525) {
            this.y = 525;
            this.speed *= -1;
        }
        if (this.y < 75) {
            this. y = 75;
            this.speed *= -1;
        }
    }
}

// creates the zombies that move in a circle around the screen (used in levels 3,5)
class CircleZombie extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/zombie.png"].texture);
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.speed = 400;
    }

    move(dt = 1 / 60) {
        if (this.x <= 100 && this.y >= 75 && this.y < 525) {
            this.x = 100;
            this.y += this.speed * dt;
        } else if (this.x >= 100 && this.y >= 525 && this.x < 900) {
            this.y = 525;
            this.x += this.speed * dt;
        } else if (this.x >= 900 && this.y <= 525 && this.y > 75) {
            this.x = 900;
            this.y -= this.speed * dt;
        } else if (this.x <= 900 && this.y <= 75 && this.x >= 100) {
            this.y = 75;
            this.x -= this.speed * dt;
        }
    }
}

// creates the keys
class Key extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/key.png"].texture);
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
    }
}