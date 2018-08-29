
// Levels
let levels = {
    // Level data
    data: [{   // First level
        ship: "ship",
        nameLevel: "Wanderer",
        background: "fon1.jpg",
        enemy: "astero",
        shot: "shot",
        weapons: 2,
        shieldBounce: 2,
        armourBounce: 3,
        levelLimit: 300
    }, {   // First level
        ship: "ship2",
        nameLevel: "Predator",
        background: "fon2.jpg",
        enemy: "astero",
        shot: "shot2",
        weapons: 2,
        shieldBounce: 3,
        armourBounce: 2,
        levelLimit: 400
    },{   // First level
        ship: "ship3",
        nameLevel: "Patrol",
        background: "fon3.jpg",
        enemy: "astero",
        shot: "shot3",
        weapons: 3,
        shieldBounce: 2,
        armourBounce: 2,
        levelLimit: 500
    }],
    // Initialize level selection screen
    init: function() {
        var levelSelectScreen = document.getElementById("levelWrap");
        // An event handler to call
        var buttonClickHandler = function(i) {
            var rulesDivLeft = document.getElementById("leftDiv");
            var rulesDivRight = document.getElementById("rightDiv");

            rulesDivLeft.classList.remove("left");
            rulesDivRight.classList.remove("right");
            let sound = new Audio();
            sound.src = "sounds/buttonPres.mp3";
            sound.play();


            game.hideScreen("levelselectscreen");
            // Level label values are 1, 2. Levels are 0, 1
            levels.load(i);
            sound.currentTime = 0;
        };
        for (let i = 0; i < levels.data.length; i++) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = levels.data[i].nameLevel.toUpperCase(); // Level labels are 1, 2
            button.addEventListener("click", () => { buttonClickHandler(i) });
            levelSelectScreen.appendChild(button);
        }
    },

    load: function(number) {
        // Declare a new currentLevel object
        game.currentLevel = { number: number };
        game.score = 0;
        game.updateScore(0);
        var level = levels.data[number];
        // Load the background, foreground, and slingshot images
        game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background);
        game.currentLevel.ship = loader.loadImage("images/" + level.ship + ".png");
        game.currentLevel.enemy = loader.loadImage("images/" + level.enemy + ".png");
        game.currentLevel.shot = loader.loadImage("images/" + level.shot + ".png");
        game.currentLevel.explosion = loader.loadImage("images/expl.png");
        game.currentLevel.shield = loader.loadImage("images/shield.png");
        game.currentLevel.shieldIcon = loader.loadImage("images/shieldIcon.png");
        game.currentLevel.box = loader.loadImage("images/cartridges.png");
        game.currentLevel.life = loader.loadImage("images/life.png");
        game.currentLevel.friend = loader.loadImage("images/satellite.png");
        // Load sound for game
        game.currentLevel.sounds = {};
        game.currentLevel.sounds.shotSound = loader.loadSound("sounds/shot");
        game.currentLevel.sounds.explosion = loader.loadSound("sounds/explosion");
        game.currentLevel.sounds.buttonPress = loader.loadSound("sounds/buttonPres");
        game.currentLevel.sounds.bonus = loader.loadSound("sounds/bonus");
        game.currentLevel.sounds.score = loader.loadSound("sounds/score");
        game.currentLevel.sounds.sweep = loader.loadSound("sounds/sweep");
        game.currentLevel.sounds.win = loader.loadSound("sounds/win");
        game.currentLevel.sounds.lose = loader.loadSound("sounds/lose");
        game.currentLevel.sounds.metronome = loader.loadSound("sounds/metronome");
        // Load level characteristics
        game.currentLevel.weapons = level.weapons;
        game.currentLevel.shieldBounce = level.shieldBounce;
        game.currentLevel.armourBounce = level.armourBounce;
        game.currentLevel.limit = level.levelLimit;
        // Call game.start() once the assets have loaded
        loader.onload = game.start;
    }
};