"use strict";

const prefix = "jrj8250-";
const unlockedLevelsKey = prefix + "unlockedLevels";

const storedUnlockedLevels = localStorage.getItem(unlockedLevelsKey);

const app = new PIXI.Application({
    width: 1000,
    height: 600
});
const div = document.querySelector("#game");
div.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// loads in images
app.loader.add([
    "images/CastleEscapeBackground.png",
    "images/castleWallBackground.png",
    "images/crosshair.png",
    "images/endGameBackground.png",
    "images/initialBackground.png",
    "images/key.png",
    "images/mainCharacter.png",
    "images/zombie.png",
    "images/zombieBig.png"
]);

app.loader.onComplete.add(setup);
app.loader.load();


let stage;


// containers that get added to stage
let startScreen;
let introScreen;
let levelSelectScreen;

let startLevelScreen;

let level1Screen;
let level2Screen;
let level3Screen;
let level4Screen;
let level5Screen;
let level6Screen;
let finishGameScreen;


let completeLevelSound;
let pickedUpKeySound;
let finishedGameSound;
let lostLevelSound;


let mainCharacters = [];
let backgrounds = [];
let zombies = [];
let finishLevelBoxes = [];
let keys = [];
let collectedKeys = 0;
let totalLevelKeys;
let currentLevel = 0;
let allKeys = false;



function setup() {
    stage = app.stage;

    // start screen
    startScreen = new PIXI.Container();
    stage.addChild(startScreen);

    // level intro screen
    introScreen = new PIXI.Container();
    introScreen.visible = false;
    stage.addChild(introScreen);

    // level select screen
    levelSelectScreen = new PIXI.Container();
    levelSelectScreen.visible = false;
    stage.addChild(levelSelectScreen);

    // start level screen
    startLevelScreen = new PIXI.Container();
    startLevelScreen.visible = false;
    stage.addChild(startLevelScreen);

    // ******* level screens *******
    // 1
    level1Screen = new PIXI.Container();
    level1Screen.visible = false;
    stage.addChild(level1Screen);
    // 2
    level2Screen = new PIXI.Container();
    level2Screen.visible = false;
    stage.addChild(level2Screen);
    // 3
    level3Screen = new PIXI.Container();
    level3Screen.visible = false;
    stage.addChild(level3Screen);
    // 4
    level4Screen = new PIXI.Container();
    level4Screen.visible = false;
    stage.addChild(level4Screen);
    // 5
    level5Screen = new PIXI.Container();
    level5Screen.visible = false;
    stage.addChild(level5Screen);
    // 6
    level6Screen = new PIXI.Container();
    level6Screen.visible = false;
    stage.addChild(level6Screen);

    // finish game screen
    finishGameScreen = new PIXI.Container();
    finishGameScreen.visible = false;
    stage.addChild(finishGameScreen);



    // creates background image for the start screen
    let startScreenBack = new PIXI.Sprite.from("images/initialBackground.png");
    startScreenBack.x = 0;
    startScreenBack.y = 0;
    startScreen.addChild(startScreenBack);

    // creates background image for the instructions screen
    let introBackground = new PIXI.Sprite.from("images/castleWallBackground.png");
    introBackground.x = 0;
    introBackground.y = 0;
    introScreen.addChild(introBackground);

    // creates background image for the level select screen
    let lvlSelectBackground = new PIXI.Sprite.from("images/castleWallBackground.png");
    lvlSelectBackground.x = 0;
    lvlSelectBackground.y = 0;
    levelSelectScreen.addChild(lvlSelectBackground);



    // creates 7 backgrounds and 7 main characters, one for each level and one for the level start screen
    for (let i = 0; i < 7; i++) {
        mainCharacters.push(new MainCharacter);
        backgrounds.push(new Background);
    }

    level1Screen.addChild(backgrounds[0]);
    level2Screen.addChild(backgrounds[1]);
    level3Screen.addChild(backgrounds[2]);
    level4Screen.addChild(backgrounds[3]);
    level5Screen.addChild(backgrounds[4]);
    level6Screen.addChild(backgrounds[5]);

    level1Screen.addChild(mainCharacters[0]);
    level2Screen.addChild(mainCharacters[1]);
    level3Screen.addChild(mainCharacters[2]);
    level4Screen.addChild(mainCharacters[3]);
    level5Screen.addChild(mainCharacters[4]);
    level6Screen.addChild(mainCharacters[5]);

    startLevelScreen.addChild(backgrounds[6]);
    startLevelScreen.addChild(mainCharacters[6]);



    // creates background image for the finish screen
    let finishBackground = new PIXI.Sprite.from("images/endGameBackground.png");
    finishBackground.x = 0;
    finishBackground.y = 0;
    finishGameScreen.addChild(finishBackground);



    createLabelsAndButtons();

    // Load sounds
    completeLevelSound = new Howl({
        src: ['sounds/completeLevel.mp3']
    });
    pickedUpKeySound = new Howl({
        src: ['sounds/pickedUpKey.mp3']
    });
    finishedGameSound = new Howl({
        src: ['sounds/finishedGame.mp3']
    });
    lostLevelSound = new Howl({
        src: ['sounds/lostLevel.mp3']
    });

    app.ticker.add(gameLoop);
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xCF0606,
        fontSize: 48,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 4
    });

    // *********************************** Start Screen ***********************************
    let gameName = new PIXI.Text("Castle Escape");
    gameName.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 120,
        fontFamily: "Fondamento",
        stroke: 0x000000,
        strokeThickness: 4
    });
    gameName.anchor.set(0.5, 0.5);
    gameName.x = 500;
    gameName.y = 150;
    startScreen.addChild(gameName);

    let creatorName = new PIXI.Text("Created By: Jacob Jablon");
    creatorName.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 36,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 3
    });
    creatorName.anchor.set(0.5, 0.5);
    creatorName.x = 500;
    creatorName.y = 220;
    startScreen.addChild(creatorName);

    let introButton = new PIXI.Text("CLICK HERE TO BEGIN");
    introButton.style = buttonStyle;
    introButton.anchor.set(0.5, 0.5);
    introButton.x = 500;
    introButton.y = 500;
    introButton.interactive = true;
    introButton.buttonMode = true;
    introButton.on("pointerup", intro);
    introButton.on('pointerover', e => e.target.alpha = 0.7);
    introButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScreen.addChild(introButton);

    // *********************************** Intro Screen ***********************************
    let instructions = new PIXI.Text("Instructions");
    instructions.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 50,
        fontFamily: "Alegreya"
    });
    instructions.anchor.set(0.5, 0.5)
    instructions.x = 500;
    instructions.y = 50;
    introScreen.addChild(instructions);

    let story = new PIXI.Text("You have been captured by the zombies and imprisoned in a castle. Make your way through the castle collecting keys to open doors and try to escape. Be careful of the zombies you will encounter along the way.");
    story.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Alegreya",
        wordWrap: true,
        wordWrapWidth: 800,
    });
    story.x = 100;
    story.y = 100;
    introScreen.addChild(story);

    let howToPlay = new PIXI.Text("How To Play");
    howToPlay.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 50,
        fontFamily: "Alegreya"
    });
    howToPlay.anchor.set(0.5, 0.5)
    howToPlay.x = 500;
    howToPlay.y = 350;
    introScreen.addChild(howToPlay);

    let howToPlayExplanation = new PIXI.Text("1. Move around using the mouse\n2. Touch keys to collect them\n3. Touch the green square to complete the level");
    howToPlayExplanation.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Alegreya",
        wordWrap: true,
        wordWrapWidth: 800,
    });
    howToPlayExplanation.x = 100;
    howToPlayExplanation.y = 400;
    introScreen.addChild(howToPlayExplanation);

    let startButton = new PIXI.Text("START>");
    startButton.style = buttonStyle;
    startButton.x = 720;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", levelSelect);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    introScreen.addChild(startButton);

    // *********************************** Level Select Screen ***********************************
    let lvlSelectHeader = new PIXI.Text("Level Select");
    lvlSelectHeader.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 60,
        fontFamily: "Alegreya"
    });
    lvlSelectHeader.anchor.set(.5, .5)
    lvlSelectHeader.x = 500;
    lvlSelectHeader.y = 80;
    levelSelectScreen.addChild(lvlSelectHeader);

    let backToInstructionsButton = new Button("<Instructions", intro, 150, 80, 40);
    levelSelectScreen.addChild(backToInstructionsButton);

    let startLVL1Button = new Button("Level 1", startLevel, 200, 250, 48, 1);
    levelSelectScreen.addChild(startLVL1Button);
    let startLVL2Button = new Button("Level 2", startLevel, 500, 250, 48, 2, false);
    levelSelectScreen.addChild(startLVL2Button);
    let startLVL3Button = new Button("Level 3", startLevel, 800, 250, 48, 3, false);
    levelSelectScreen.addChild(startLVL3Button);
    let startLVL4Button = new Button("Level 4", startLevel, 200, 400, 48, 4, false);
    levelSelectScreen.addChild(startLVL4Button);
    let startLVL5Button = new Button("Level 5", startLevel, 500, 400, 48, 5, false);
    levelSelectScreen.addChild(startLVL5Button);
    let startLVL6Button = new Button("Level 6", startLevel, 800, 400, 48, 6, false);
    levelSelectScreen.addChild(startLVL6Button);

    let finishGameButton = new Button("Finish>", finishGame, 875, 550, 40, 0, false);
    levelSelectScreen.addChild(finishGameButton);

    // *********************************** Start Level Screen ***********************************
    const darkenBackgroundRect = new PIXI.Graphics();
    darkenBackgroundRect.beginFill(0x000000, 0.5);
    darkenBackgroundRect.drawRect(0, 0, 1000, 600);
    darkenBackgroundRect.endFill();
    darkenBackgroundRect.x = 0;
    darkenBackgroundRect.y = 0;
    startLevelScreen.addChild(darkenBackgroundRect);

    let direction = new PIXI.Text("<<< Move your pointer here");
    direction.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 60,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 4,
    });
    direction.anchor.set(0.5, 0.5)
    direction.x = 500;
    direction.y = 300;
    startLevelScreen.addChild(direction);

    let backToLvlSelectButton = new Button("Level Select", levelSelect, 200, 25, 30);
    startLevelScreen.addChild(backToLvlSelectButton);

    // *********************************** Level Screens ***********************************
    let backToLvlSelectButton1 = new Button("Level Select", levelSelect, 200, 25, 30);
    level1Screen.addChild(backToLvlSelectButton1);
    let backToLvlSelectButton2 = new Button("Level Select", levelSelect, 200, 25, 30);
    level2Screen.addChild(backToLvlSelectButton2);
    let backToLvlSelectButton3 = new Button("Level Select", levelSelect, 200, 25, 30);
    level3Screen.addChild(backToLvlSelectButton3);
    let backToLvlSelectButton4 = new Button("Level Select", levelSelect, 200, 25, 30);
    level4Screen.addChild(backToLvlSelectButton4);
    let backToLvlSelectButton5 = new Button("Level Select", levelSelect, 200, 25, 30);
    level5Screen.addChild(backToLvlSelectButton5);
    let backToLvlSelectButton6 = new Button("Level Select", levelSelect, 200, 25, 30);
    level6Screen.addChild(backToLvlSelectButton6);

    let levelName1 = new LevelHeader("Level 1");
    level1Screen.addChild(levelName1);
    let levelName2 = new LevelHeader("Level 2");
    level2Screen.addChild(levelName2);
    let levelName3 = new LevelHeader("Level 3");
    level3Screen.addChild(levelName3);
    let levelName4 = new LevelHeader("Level 4");
    level4Screen.addChild(levelName4);
    let levelName5 = new LevelHeader("Level 5");
    level5Screen.addChild(levelName5);
    let levelName6 = new LevelHeader("Level 6");
    level6Screen.addChild(levelName6);

    // *********************************** Finish Game Screen ***********************************
    let finishHeader = new PIXI.Text("You Made it Out!");
    finishHeader.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 60,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 4,
    });
    finishHeader.anchor.set(.5, .5)
    finishHeader.x = 500;
    finishHeader.y = 80;
    finishGameScreen.addChild(finishHeader);

    let thegameName = new PIXI.Text("Castle Escape");
    thegameName.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 100,
        fontFamily: "Fondamento",
        stroke: 0x000000,
        strokeThickness: 4
    });
    thegameName.anchor.set(0.5, 0.5);
    thegameName.x = 325;
    thegameName.y = 250;
    finishGameScreen.addChild(thegameName);

    let createdBy = new PIXI.Text("Created By: Jacob Jablon");
    createdBy.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 36,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 3
    });
    createdBy.anchor.set(0.5, 0.5);
    createdBy.x = 225;
    createdBy.y = 315;
    finishGameScreen.addChild(createdBy);

    let thanks = new PIXI.Text("Thanks for Playing!");
    thanks.style = new PIXI.TextStyle({
        fill: 0xDBA00B,
        fontSize: 36,
        fontFamily: "Alegreya",
        stroke: 0x000000,
        strokeThickness: 3
    });
    thanks.anchor.set(0.5, 0.5);
    thanks.x = 775;
    thanks.y = 500;
    finishGameScreen.addChild(thanks);

    let backToLvlSelectButton7 = new Button("<Return", levelSelect, 180, 555, 40);
    finishGameScreen.addChild(backToLvlSelectButton7);





    if (storedUnlockedLevels) {
        if (storedUnlockedLevels >= 2) {
            createButtonForNewUnlockedLevel("Level 2", startLevel, 500, 250, 48, 2);
        }
        if (storedUnlockedLevels >= 3) {
            createButtonForNewUnlockedLevel("Level 3", startLevel, 800, 250, 48, 3);
        }
        if (storedUnlockedLevels >= 4) {
            createButtonForNewUnlockedLevel("Level 4", startLevel, 200, 400, 48, 4);
        }
        if (storedUnlockedLevels >= 5) {
            createButtonForNewUnlockedLevel("Level 5", startLevel, 500, 400, 48, 5);
        }
        if (storedUnlockedLevels >= 6) {
            createButtonForNewUnlockedLevel("Level 6", startLevel, 800, 400, 48, 6);
        }
        if (storedUnlockedLevels >= 7) {
            createButtonForNewUnlockedLevel("Finish>", finishGame, 875, 550, 40, 0);
        }
    }
}

function gameLoop() {
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    let mousePosition = app.renderer.plugins.interaction.mouse.global;

    let amt = 10 * dt;

    // sets the coords of the main character to follow the coords of the mouse on each level
    for (let i = 0; i < 6; i++) {
        let newX = lerp(mainCharacters[i].x, mousePosition.x, amt);
        let newY = lerp(mainCharacters[i].y, mousePosition.y, amt);

        let w2 = mainCharacters[i].width / 2;
        let h2 = mainCharacters[i].height / 2;
        mainCharacters[i].x = clamp(newX, 75 + w2, sceneWidth - 75 - w2);
        mainCharacters[i].y = clamp(newY, 50 + h2, sceneHeight - 50 - h2);
    }

    // sets the zombies in motion
    for (let z of zombies) {
        z.move(dt);
    }


    for (let z of zombies) {
        if (rectsIntersect(z, mainCharacters[currentLevel - 1])) {
            lostLevelSound.play();
            zombies.forEach(z => level1Screen.removeChild(z));
            zombies.forEach(z => level2Screen.removeChild(z));
            zombies.forEach(z => level3Screen.removeChild(z));
            zombies.forEach(z => level4Screen.removeChild(z));
            zombies.forEach(z => level5Screen.removeChild(z));
            zombies.forEach(z => level6Screen.removeChild(z));
            zombies.splice(0);

            collectedKeys = 0;
            allKeys = false;
            if (currentLevel == 1) {
                level1Screen.children.splice(-1, 1);
            } else if (currentLevel == 2) {
                level2Screen.children.splice(-1, 1);
            } else if (currentLevel == 3) {
                level3Screen.children.splice(-1, 1);
            } else if (currentLevel == 4) {
                level4Screen.children.splice(-1, 1);
            } else if (currentLevel == 5) {
                level5Screen.children.splice(-1, 1);
            } else if (currentLevel == 6) {
                level6Screen.children.splice(-1, 1);
            }

            finishLevelBoxes.splice(0);

            keys.splice(0);

            startLevel();
        }
    }


    if (finishLevelBoxes.length == 0 && allKeys == true && currentLevel !== 0) {
        let finishLevelArea = new FinishLevelBox();
        if (currentLevel == 1) {
            level1Screen.addChild(finishLevelArea);
        } else if (currentLevel == 2) {
            level2Screen.addChild(finishLevelArea);
        } else if (currentLevel == 3) {
            level3Screen.addChild(finishLevelArea);
        } else if (currentLevel == 4) {
            level4Screen.addChild(finishLevelArea);
        } else if (currentLevel == 5) {
            level5Screen.addChild(finishLevelArea);
        } else if (currentLevel == 6) {
            level6Screen.addChild(finishLevelArea);
        }
        finishLevelBoxes.push(finishLevelArea);
    }

    if (finishLevelBoxes.length == 1) {
        if (rectsIntersect(finishLevelBoxes[0], mainCharacters[currentLevel - 1])) {
            completeLevelSound.play();
            levelSelect();
            allKeys = false;


            if (currentLevel == 1) {
                localStorage.setItem(unlockedLevelsKey, 2);
                createButtonForNewUnlockedLevel("Level 2", startLevel, 500, 250, 48, 2);
                level1Screen.children.splice(-1, 1);
            } else if (currentLevel == 2) {
                localStorage.setItem(unlockedLevelsKey, 3);
                createButtonForNewUnlockedLevel("Level 3", startLevel, 800, 250, 48, 3);
                level2Screen.children.splice(-1, 1);
            } else if (currentLevel == 3) {
                localStorage.setItem(unlockedLevelsKey, 4);
                createButtonForNewUnlockedLevel("Level 4", startLevel, 200, 400, 48, 4);
                level3Screen.children.splice(-1, 1);
            } else if (currentLevel == 4) {
                localStorage.setItem(unlockedLevelsKey, 5);
                createButtonForNewUnlockedLevel("Level 5", startLevel, 500, 400, 48, 5);
                level4Screen.children.splice(-1, 1);
            } else if (currentLevel == 5) {
                localStorage.setItem(unlockedLevelsKey, 6);
                createButtonForNewUnlockedLevel("Level 6", startLevel, 800, 400, 48, 6);
                level5Screen.children.splice(-1, 1);
            } else if (currentLevel == 6) {
                localStorage.setItem(unlockedLevelsKey, 7);
                createButtonForNewUnlockedLevel("Finish>", finishGame, 875, 550, 40, 0);
                level6Screen.children.splice(-1, 1);
            }

            currentLevel = 0;

            finishLevelBoxes.splice(0);
        }
    }





    // key stuff
    if (keys.length > 0) {
        for (let k of keys) {
            if (rectsIntersect(k, mainCharacters[currentLevel - 1])) {
                pickedUpKeySound.play();
                collectedKeys += 1;
                if (currentLevel == 1) {
                    level1Screen.removeChild(k);
                } else if (currentLevel == 2) {
                    level2Screen.removeChild(k)
                } else if (currentLevel == 3) {
                    level3Screen.removeChild(k)
                } else if (currentLevel == 4) {
                    level4Screen.removeChild(k)
                } else if (currentLevel == 5) {
                    level5Screen.removeChild(k)
                } else if (currentLevel == 6) {
                    level6Screen.removeChild(k)
                }

                let kIndex = keys.indexOf(k);
                keys.splice(kIndex, 1);
            }
        }
        if (totalLevelKeys == collectedKeys) {
            allKeys = true;
            collectedKeys = 0;
        }
    }


}

function intro() {
    startScreen.visible = false;
    levelSelectScreen.visible = false;
    introScreen.visible = true;

}

function levelSelect() {
    introScreen.visible = false;
    levelSelectScreen.visible = true;
    level1Screen.visible = false;
    level2Screen.visible = false;
    level3Screen.visible = false;
    level4Screen.visible = false;
    level5Screen.visible = false;
    level6Screen.visible = false;
    startLevelScreen.visible = false;
    finishGameScreen.visible = false;



    zombies.forEach(z => level1Screen.removeChild(z));
    zombies.forEach(z => level2Screen.removeChild(z));
    zombies.forEach(z => level3Screen.removeChild(z));
    zombies.forEach(z => level4Screen.removeChild(z));
    zombies.forEach(z => level5Screen.removeChild(z));
    zombies.forEach(z => level6Screen.removeChild(z));
    zombies.splice(0);

    keys.forEach(k => level1Screen.removeChild(k));
    keys.forEach(k => level2Screen.removeChild(k));
    keys.forEach(k => level3Screen.removeChild(k));
    keys.forEach(k => level4Screen.removeChild(k));
    keys.forEach(k => level5Screen.removeChild(k));
    keys.forEach(k => level6Screen.removeChild(k));
    keys.splice(0);
}

function startLevel() {
    levelSelectScreen.visible = false;
    level1Screen.visible = false;
    level2Screen.visible = false;
    level3Screen.visible = false;
    level4Screen.visible = false;
    level5Screen.visible = false;
    level6Screen.visible = false;
    startLevelScreen.visible = true;


    let startLevel;
    if (currentLevel == 1) {
        startLevel = new StartLevelButton(level1);
    } else if (currentLevel == 2) {
        startLevel = new StartLevelButton(level2);
    } else if (currentLevel == 3) {
        startLevel = new StartLevelButton(level3);
    } else if (currentLevel == 4) {
        startLevel = new StartLevelButton(level4);
    } else if (currentLevel == 5) {
        startLevel = new StartLevelButton(level5);
    } else if (currentLevel == 6) {
        startLevel = new StartLevelButton(level6);
    }

    startLevelScreen.children.splice(5, 1); // removes the start lvl button if one was already placed
    startLevelScreen.addChild(startLevel); // adds the start lvl button

    mainCharacters.x = 87.5;
    mainCharacters.y = 300;
}

function level1() {

    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level1Screen.visible = true;

    let zombie1 = new HorizontalZombie(sceneWidth - 100, 100);
    zombies.push(zombie1);
    level1Screen.addChild(zombie1);
    let zombie2 = new HorizontalZombie(100, 200);
    zombies.push(zombie2);
    level1Screen.addChild(zombie2);
    let zombie3 = new HorizontalZombie(sceneWidth - 100, 300);
    zombies.push(zombie3);
    level1Screen.addChild(zombie3);
    let zombie4 = new HorizontalZombie(100, 400);
    zombies.push(zombie4);
    level1Screen.addChild(zombie4);
    let zombie5 = new HorizontalZombie(sceneWidth - 100, 500);
    zombies.push(zombie5);
    level1Screen.addChild(zombie5);


    let key1 = new Key(500, 300);
    keys.push(key1);
    level1Screen.addChild(key1);

    totalLevelKeys = keys.length;
}

function level2() {

    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level2Screen.visible = true;

    let zombie1 = new VericalZombie(150, sceneHeight - 75);
    zombies.push(zombie1);
    level2Screen.addChild(zombie1);
    let zombie2 = new VericalZombie(250, 75);
    zombies.push(zombie2);
    level2Screen.addChild(zombie2);
    let zombie3 = new VericalZombie(350, sceneHeight - 75);
    zombies.push(zombie3);
    level2Screen.addChild(zombie3);
    let zombie4 = new VericalZombie(450, 75);
    zombies.push(zombie4);
    level2Screen.addChild(zombie4);
    let zombie5 = new VericalZombie(550, sceneHeight - 75);
    zombies.push(zombie5);
    level2Screen.addChild(zombie5);
    let zombie6 = new VericalZombie(650, 75);
    zombies.push(zombie6);
    level2Screen.addChild(zombie6);
    let zombie7 = new VericalZombie(750, sceneHeight - 75);
    zombies.push(zombie7);
    level2Screen.addChild(zombie7);
    let zombie8 = new VericalZombie(850, 75);
    zombies.push(zombie8);
    level2Screen.addChild(zombie8);


    let key1 = new Key(500, 75);
    keys.push(key1);
    level2Screen.addChild(key1);
    let key2 = new Key(500, 525);
    keys.push(key2);
    level2Screen.addChild(key2);

    totalLevelKeys = keys.length;
}

function level3() {
    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level3Screen.visible = true;

    let zombie1 = new HorizontalZombie(sceneWidth - 100, 100);
    zombies.push(zombie1);
    level3Screen.addChild(zombie1);
    let zombie2 = new HorizontalZombie(100, 200);
    zombies.push(zombie2);
    level3Screen.addChild(zombie2);
    let zombie3 = new HorizontalZombie(sceneWidth - 100, 300);
    zombies.push(zombie3);
    level3Screen.addChild(zombie3);
    let zombie4 = new HorizontalZombie(100, 400);
    zombies.push(zombie4);
    level3Screen.addChild(zombie4);
    let zombie5 = new HorizontalZombie(sceneWidth - 100, 500);
    zombies.push(zombie5);
    level3Screen.addChild(zombie5);

    let zombie6 = new CircleZombie(100, 75);
    zombies.push(zombie6);
    level3Screen.addChild(zombie6);
    let zombie7 = new CircleZombie(100, 525);
    zombies.push(zombie7);
    level3Screen.addChild(zombie7);
    let zombie8 = new CircleZombie(900, 525);
    zombies.push(zombie8);
    level3Screen.addChild(zombie8);
    let zombie9 = new CircleZombie(900, 75);
    zombies.push(zombie9);
    level3Screen.addChild(zombie9);


    let key1 = new Key(100, 75);
    keys.push(key1);
    level3Screen.addChild(key1);
    let key2 = new Key(100, 525);
    keys.push(key2);
    level3Screen.addChild(key2);
    let key3 = new Key(900, 525);
    keys.push(key3);
    level3Screen.addChild(key3);
    let key4 = new Key(900, 75);
    keys.push(key4);
    level3Screen.addChild(key4);

    totalLevelKeys = keys.length;
}

function level4() {
    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level4Screen.visible = true;

    let zombie1 = new VericalZombie(150, sceneHeight - 75);
    zombies.push(zombie1);
    level4Screen.addChild(zombie1);
    let zombie2 = new VericalZombie(250, 75);
    zombies.push(zombie2);
    level4Screen.addChild(zombie2);
    let zombie3 = new VericalZombie(350, sceneHeight - 75);
    zombies.push(zombie3);
    level4Screen.addChild(zombie3);
    let zombie4 = new VericalZombie(450, 75);
    zombies.push(zombie4);
    level4Screen.addChild(zombie4);
    let zombie5 = new VericalZombie(550, sceneHeight - 75);
    zombies.push(zombie5);
    level4Screen.addChild(zombie5);
    let zombie6 = new VericalZombie(650, 75);
    zombies.push(zombie6);
    level4Screen.addChild(zombie6);
    let zombie7 = new VericalZombie(750, sceneHeight - 75);
    zombies.push(zombie7);
    level4Screen.addChild(zombie7);
    let zombie8 = new VericalZombie(850, 75);
    zombies.push(zombie8);
    level4Screen.addChild(zombie8);

    let zombie9 = new HorizontalZombie(sceneWidth - 100, 100);
    zombies.push(zombie9);
    level4Screen.addChild(zombie9);
    let zombie10 = new HorizontalZombie(100, 200);
    zombies.push(zombie10);
    level4Screen.addChild(zombie10);
    let zombie11 = new HorizontalZombie(sceneWidth - 100, 300);
    zombies.push(zombie11);
    level4Screen.addChild(zombie11);
    let zombie12 = new HorizontalZombie(100, 400);
    zombies.push(zombie12);
    level4Screen.addChild(zombie12);
    let zombie13 = new HorizontalZombie(sceneWidth - 100, 500);
    zombies.push(zombie13);
    level4Screen.addChild(zombie13);


    let key1 = new Key(100, 75);
    keys.push(key1);
    level4Screen.addChild(key1);
    let key2 = new Key(100, 525);
    keys.push(key2);
    level4Screen.addChild(key2);
    let key3 = new Key(900, 525);
    keys.push(key3);
    level4Screen.addChild(key3);
    let key4 = new Key(900, 75);
    keys.push(key4);
    level4Screen.addChild(key4);
    let key5 = new Key(500, 300);
    keys.push(key5);
    level4Screen.addChild(key5);

    totalLevelKeys = keys.length;
}

function level5() {
    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level5Screen.visible = true;

    let zombie1 = new VericalZombie(150, sceneHeight - 75);
    zombies.push(zombie1);
    level5Screen.addChild(zombie1);
    let zombie2 = new VericalZombie(250, 75);
    zombies.push(zombie2);
    level5Screen.addChild(zombie2);
    let zombie3 = new VericalZombie(350, sceneHeight - 75);
    zombies.push(zombie3);
    level5Screen.addChild(zombie3);
    let zombie4 = new VericalZombie(450, 75);
    zombies.push(zombie4);
    level5Screen.addChild(zombie4);
    let zombie5 = new VericalZombie(550, sceneHeight - 75);
    zombies.push(zombie5);
    level5Screen.addChild(zombie5);
    let zombie6 = new VericalZombie(650, 75);
    zombies.push(zombie6);
    level5Screen.addChild(zombie6);
    let zombie7 = new VericalZombie(750, sceneHeight - 75);
    zombies.push(zombie7);
    level5Screen.addChild(zombie7);
    let zombie8 = new VericalZombie(850, 75);
    zombies.push(zombie8);
    level5Screen.addChild(zombie8);

    let zombie9 = new HorizontalZombie(sceneWidth - 100, 100);
    zombies.push(zombie9);
    level5Screen.addChild(zombie9);
    let zombie10 = new HorizontalZombie(100, 200);
    zombies.push(zombie10);
    level5Screen.addChild(zombie10);
    let zombie11 = new HorizontalZombie(sceneWidth - 100, 300);
    zombies.push(zombie11);
    level5Screen.addChild(zombie11);
    let zombie12 = new HorizontalZombie(100, 400);
    zombies.push(zombie12);
    level5Screen.addChild(zombie12);
    let zombie13 = new HorizontalZombie(sceneWidth - 100, 500);
    zombies.push(zombie13);
    level5Screen.addChild(zombie13);

    let zombie14 = new CircleZombie(100, 75);
    zombies.push(zombie14);
    level5Screen.addChild(zombie14);
    let zombie15 = new CircleZombie(100, 525);
    zombies.push(zombie15);
    level5Screen.addChild(zombie15);
    let zombie16 = new CircleZombie(900, 525);
    zombies.push(zombie16);
    level5Screen.addChild(zombie16);
    let zombie17 = new CircleZombie(900, 75);
    zombies.push(zombie17);
    level5Screen.addChild(zombie17);


    let key1 = new Key(100, 75);
    keys.push(key1);
    level5Screen.addChild(key1);
    let key2 = new Key(100, 525);
    keys.push(key2);
    level5Screen.addChild(key2);
    let key3 = new Key(900, 525);
    keys.push(key3);
    level5Screen.addChild(key3);
    let key4 = new Key(900, 75);
    keys.push(key4);
    level5Screen.addChild(key4);
    let key5 = new Key(500, 300);
    keys.push(key5);
    level5Screen.addChild(key5);

    totalLevelKeys = keys.length;
}

function level6() {
    levelSelectScreen.visible = false;
    startLevelScreen.visible = false;
    level6Screen.visible = true;

    let zombie1 = new HorizontalZombie(200, 75);
    zombies.push(zombie1);
    level6Screen.addChild(zombie1);
    let zombie2 = new HorizontalZombie(200, 125);
    zombies.push(zombie2);
    level6Screen.addChild(zombie2);
    let zombie3 = new HorizontalZombie(200, 175);
    zombies.push(zombie3);
    level6Screen.addChild(zombie3);
    let zombie4 = new HorizontalZombie(200, 225);
    zombies.push(zombie4);
    level6Screen.addChild(zombie4);
    let zombie5 = new HorizontalZombie(200, 275);
    zombies.push(zombie5);
    level6Screen.addChild(zombie5);
    let zombie6 = new HorizontalZombie(200, 325);
    zombies.push(zombie6);
    level6Screen.addChild(zombie6);
    let zombie7 = new HorizontalZombie(200, 375);
    zombies.push(zombie7);
    level6Screen.addChild(zombie7);
    let zombie8 = new HorizontalZombie(200, 425);
    zombies.push(zombie8);
    level6Screen.addChild(zombie8);

    let zombie9 = new HorizontalZombie(350, 75);
    zombies.push(zombie9);
    level6Screen.addChild(zombie9);
    let zombie10 = new HorizontalZombie(350, 125);
    zombies.push(zombie10);
    level6Screen.addChild(zombie10);
    let zombie11 = new HorizontalZombie(350, 175);
    zombies.push(zombie11);
    level6Screen.addChild(zombie11);
    let zombie12 = new HorizontalZombie(350, 225);
    zombies.push(zombie12);
    level6Screen.addChild(zombie12);
    let zombie13 = new HorizontalZombie(350, 275);
    zombies.push(zombie13);
    level6Screen.addChild(zombie13);
    let zombie14 = new HorizontalZombie(350, 325);
    zombies.push(zombie14);
    level6Screen.addChild(zombie14);
    let zombie15 = new HorizontalZombie(350, 475);
    zombies.push(zombie15);
    level6Screen.addChild(zombie15);
    let zombie16 = new HorizontalZombie(350, 525);
    zombies.push(zombie16);
    level6Screen.addChild(zombie16);

    let zombie17 = new HorizontalZombie(500, 75);
    zombies.push(zombie17);
    level6Screen.addChild(zombie17);
    let zombie18 = new HorizontalZombie(500, 125);
    zombies.push(zombie18);
    level6Screen.addChild(zombie18);
    let zombie19 = new HorizontalZombie(500, 175);
    zombies.push(zombie19);
    level6Screen.addChild(zombie19);
    let zombie20 = new HorizontalZombie(500, 225);
    zombies.push(zombie20);
    level6Screen.addChild(zombie20);
    let zombie21 = new HorizontalZombie(500, 375);
    zombies.push(zombie21);
    level6Screen.addChild(zombie21);
    let zombie22 = new HorizontalZombie(500, 425);
    zombies.push(zombie22);
    level6Screen.addChild(zombie22);
    let zombie23 = new HorizontalZombie(500, 475);
    zombies.push(zombie23);
    level6Screen.addChild(zombie23);
    let zombie24 = new HorizontalZombie(500, 525);
    zombies.push(zombie24);
    level6Screen.addChild(zombie24);

    let zombie25 = new HorizontalZombie(650, 75);
    zombies.push(zombie25);
    level6Screen.addChild(zombie25);
    let zombie26 = new HorizontalZombie(650, 125);
    zombies.push(zombie26);
    level6Screen.addChild(zombie26);
    let zombie27 = new HorizontalZombie(650, 275);
    zombies.push(zombie27);
    level6Screen.addChild(zombie27);
    let zombie28 = new HorizontalZombie(650, 325);
    zombies.push(zombie28);
    level6Screen.addChild(zombie28);
    let zombie29 = new HorizontalZombie(650, 375);
    zombies.push(zombie29);
    level6Screen.addChild(zombie29);
    let zombie30 = new HorizontalZombie(650, 425);
    zombies.push(zombie30);
    level6Screen.addChild(zombie30);
    let zombie31 = new HorizontalZombie(650, 475);
    zombies.push(zombie31);
    level6Screen.addChild(zombie31);
    let zombie32 = new HorizontalZombie(650, 525);
    zombies.push(zombie32);
    level6Screen.addChild(zombie32);

    let zombie33 = new HorizontalZombie(800, 175);
    zombies.push(zombie33);
    level6Screen.addChild(zombie33);
    let zombie34 = new HorizontalZombie(800, 225);
    zombies.push(zombie34);
    level6Screen.addChild(zombie34);
    let zombie35 = new HorizontalZombie(800, 275);
    zombies.push(zombie35);
    level6Screen.addChild(zombie35);
    let zombie36 = new HorizontalZombie(800, 325);
    zombies.push(zombie36);
    level6Screen.addChild(zombie36);
    let zombie37 = new HorizontalZombie(800, 375);
    zombies.push(zombie37);
    level6Screen.addChild(zombie37);
    let zombie38 = new HorizontalZombie(800, 425);
    zombies.push(zombie38);
    level6Screen.addChild(zombie38);
    let zombie39 = new HorizontalZombie(800, 475);
    zombies.push(zombie39);
    level6Screen.addChild(zombie39);
    let zombie40 = new HorizontalZombie(800, 525);
    zombies.push(zombie40);
    level6Screen.addChild(zombie40);

    let zombieBig = new VericalZombie(800, 100, 1);
    zombies.push(zombieBig);
    level6Screen.addChild(zombieBig);

    let key1 = new Key(900, 75);
    keys.push(key1);
    level6Screen.addChild(key1);
    let key2 = new Key(900, 525);
    keys.push(key2);
    level6Screen.addChild(key2);

    totalLevelKeys = keys.length;
}

function finishGame() {
    levelSelectScreen.visible = false;
    finishGameScreen.visible = true;

    finishedGameSound.play();
}

function createButtonForNewUnlockedLevel(leveltitle, direction, x , y, size, lvl) {
    levelSelectScreen.addChild(new Button(leveltitle, direction, x, y, size, lvl));
}