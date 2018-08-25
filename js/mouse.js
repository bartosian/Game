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
    }
};