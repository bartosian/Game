var game = {
    // Start initializing objects, preloading assets and display start screen
    init: function() {
        //Get handler for game canvas and context
        game.canvas = document.getElementById("gamecanvas");
        game.context = game.canvas.getContext("2d");
        // Initialize objects
        levels.init();
        loader.init();

        // Hide all game layers and display the start screen
        game.hideScreens();
        game.showScreen("gamestartscreen");
    },
    //
    hideScreens: function() {
        var screens = document.getElementsByClassName("gamelayer");
        // Iterate through all the game layers and set their display to none
        for (let i = screens.length - 1; i >= 0; i--) {
            var screen = screens[i];
            screen.style.display = "none";
        }
    },
    hideScreen: function(id) {
        var screen = document.getElementById(id);
        screen.style.display = "none";
    },
    showScreen: function(id) {
        var screen = document.getElementById(id);
        screen.style.display = "block";
    },

    showLevelScreen: function() {
        game.hideScreens();
        game.showScreen("levelselectscreen");
    },
};

// Initialize game once page has fully loaded
window.addEventListener("load", function() {
    game.init();
});

// Levels
var levels = {
    // Level data
    data: [{   // First level
        ship: "ship",
        background: "fon",
        enemy: "astero",
        entities: []
    }],
    // Initialize level selection screen
    init: function() {
        var levelSelectScreen = document.getElementById("levelWrap");
        // An event handler to call
        var buttonClickHandler = function() {
            game.hideScreen("levelselectscreen");
            // Level label values are 1, 2. Levels are 0, 1
            levels.load(this.value - 1);
        };
        for (let i = 0; i < levels.data.length; i++) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = "Level " + (i + 1); // Level labels are 1, 2
            button.addEventListener("click", buttonClickHandler);
            levelSelectScreen.appendChild(button);
        }
    },
    // Load all data and images for a specific level
    load: function(number) {
        // Declare a new currentLevel object
        game.currentLevel = { number: number };
        game.score = 0;
        document.getElementById("score").innerHTML = "Score: " + game.score;
        var level = levels.data[number];
        // Load the background, foreground, and slingshot images
        game.currentLevel.backgroundImage = loader.loadImage("images/" + level.background + ".png");
        game.currentLevel.ship = loader.loadImage("images/" + level.ship + ".png");
        game.enemy = loader.loadImage("images/" + level.enemy + ".png");
        game.shot= loader.loadImage("images/fire.png");
        game.explosion = loader.loadImage("images/expl.png");
        game.shield = loader.shield("images/shield.png");
        // Call game.start() once the assets have loaded
        loader.onload = game.start;
    }
};

// Loader

var loader = {
    loaded: true,
    loadedCount: 0, // Assets that have been loaded so far
    totalCount: 0, // Total number of assets that need loading
    init: function() {
        // Check for sound support
        var mp3Support, oggSupport;
        var audio = document.createElement("audio");
        if (audio.canPlayType) {
            // Currently canPlayType() returns:  "", "maybe" or "probably"
            mp3Support = "" !== audio.canPlayType("audio/mpeg");
            oggSupport = "" !== audio.canPlayType("audio/ogg; codecs=\"vorbis\"");
        } else {
            // The audio tag is not supported
            mp3Support = false;
            oggSupport = false;
        }
        // Check for ogg, then mp3, and finally set soundFileExtn to undefined
        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
    },
    loadImage: function(url) {
        this.loaded = false;
        this.totalCount++;
        game.showScreen("loadingscreen");
        var image = new Image();
        image.addEventListener("load", loader.itemLoaded, false);
        image.src = url;
        return image;
    },
    soundFileExtn: ".ogg",
    loadSound: function(url) {
        this.loaded = false;
        this.totalCount++;
        game.showScreen("loadingscreen");
        var audio = new Audio();
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        audio.src = url + loader.soundFileExtn;
        return audio;
    },
    itemLoaded: function(ev) {
        ev.target.removeEventListener(ev.type, loader.itemLoaded, false);
        loader.loadedCount++;
        document.getElementById("loadingmessage").innerHTML = "Loaded " + loader.loadedCount
            + " of " + loader.totalCount;
        if (loader.loadedCount === loader.totalCount) {
            // Loader has loaded completely..
            // Reset and clear the loader
            loader.loaded = true;
            loader.loadedCount = 0;
            loader.totalCount = 0;
            // Hide the loading screen
            game.hideScreen("loadingscreen");
            // and call the loader.onload method if it exists
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        } }
};




































