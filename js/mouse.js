// Mouse object to handle events
var mouse = {
    init: function() {
        var canvas = document.getElementById("gamecanvas");
        canvas.addEventListener("mousemove",
            mouse.mousemovehandler, false);
        var homeBtn = document.getElementById("prev");
        homeBtn.addEventListener("click", mouse.mouseClickHomeBtnHandler, false);

        var musicBtn = document.getElementById("togglemusic");
        musicBtn.addEventListener("click", mouse.mouseClickSoundBtnHandler, false );

        var reloadBtn = document.getElementById("reload");
        reloadBtn.addEventListener("click", mouse.mouseClickReloadBtnHandler, false);

        var restartBtn = document.getElementById("playcurrentlevel");
        restartBtn.addEventListener("click", mouse.mouseClickRestartLevelBtnHandler, false);

        var playNextLelBtn = document.getElementById("playnextlevel");
        playNextLelBtn.addEventListener("click", mouse.mouseClickNextLevelBtn, false);

        var levelScreenBtn = document.getElementById("returntolevelscreen");
        levelScreenBtn.addEventListener("click", mouse.mouseClickLevelsScreen, false);
    },
    mousemovehandler: function(ev) {
        game.ship.x=event.offsetX-25;
        game.ship.y=event.offsetY-13;
    },

    mouseClickHomeBtnHandler: function() {
        game.finish();
    },

    mouseClickSoundBtnHandler: function() {
        if(game.currentLevel.sounds.length) {
            for(var sound of game.currentLevel.sounds) {
                sound.muted = !sound.muted;
            }
        }
    },

    mouseClickReloadBtnHandler: function() {
        game.score = 0;
        document.getElementById("score").innerHTML = "Score: " + game.score;
        // Call game.start() once the assets have loaded
        game.asteroids = [];
        game.fires = [];
        game.explosions = [];
        game.ship = {x:350,y:350,animx:0,animy:0};
        game.Timer = 0;
    },

    mouseClickRestartLevelBtnHandler: function () {
        levels.load(game.currentLevel.number);
    },

    mouseClickNextLevelBtn: function() {
        var curLevel = game.currentLevel.number;

        if(levels.data.length > (curLevel + 1)) {
            levels.load(curLevel + 1);
        } else {
            levels.load(0);
        }

    },

    mouseClickLevelsScreen: function() {
        game.hideScreens();
        game.showScreen("levelselectscreen");
    }
};