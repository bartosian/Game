
// Levels
var levels = {
    // Level data
    data: [{   // First level
        ship: "ship",
        background: "fon",
        enemy: "astero",
        entities: []
    }, {   // First level
        ship: "ship",
        background: "fon",
        enemy: "astero",
        entities: []
    }],
    // Initialize level selection screen
    init: function() {
        var levelSelectScreen = document.getElementById("levelWrap");
        // An event handler to call
        var buttonClickHandler = function(i) {
            game.hideScreen("levelselectscreen");
            // Level label values are 1, 2. Levels are 0, 1
            levels.load(i);
        };
        for (let i = 0; i < levels.data.length; i++) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = "Level " + (i + 1); // Level labels are 1, 2
            button.addEventListener("click", () => { buttonClickHandler(i) });
            levelSelectScreen.appendChild(button);
        }
    },

    load: function(number) {
        // Declare a new currentLevel object
        game.currentLevel = { number: number };
        game.score = 0;
        document.getElementById("score").innerHTML = "Score: " + game.score;
        var level = levels.data[number];
        // Load the background, foreground, and slingshot images
        game.currentLevel.backgroundImage = loader.loadImage("images/" + level.background + ".png");
        game.currentLevel.ship = loader.loadImage("images/" + level.ship + ".png");
        game.currentLevel.enemy = loader.loadImage("images/" + level.enemy + ".png");
        game.currentLevel.shot = loader.loadImage("images/shot.png");
        game.currentLevel.explosion = loader.loadImage("images/expl.png");
        game.currentLevel.shield = loader.loadImage("images/shield.png");
        // Call game.start() once the assets have loaded
        loader.onload = game.start;
    }
};