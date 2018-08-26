// Checking for support requestAnimationFrame

var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 20);
        };
})();

// Main game object

var game = {

    // Start initializing objects, preloading assets and display start screen
    init: function() {
        //Get handler for game canvas and context
        game.canvas = document.getElementById("gamecanvas");
        game.context = game.canvas.getContext("2d");
        // Initialize objects
        levels.init();
        loader.init();
        mouse.init();
        // Hide all game layers and display the start screen
        game.hideScreens();
        game.showScreen("gamestartscreen");
    },
    // Hide all the screens
    hideScreens: function() {
        var screens = document.getElementsByClassName("gamelayer");
        // Iterate through all the game layers and set their display to none
        for (let i = screens.length - 1; i >= 0; i--) {
            var screen = screens[i];
            screen.style.display = "none";
        }
    },
    // Hide specific screen
    hideScreen: function(id) {
        var screen = document.getElementById(id);
        screen.style.display = "none";
    },
    // Show specific screen
    showScreen: function(id) {
        var screen = document.getElementById(id);
        screen.style.display = "block";
    },
    // Show Level Screen
    showLevelScreen: function() {
        game.hideScreens();
        game.showScreen("levelselectscreen");
    },

    // Start game
    start: function() {
        // Hide Screen
        game.hideScreens();
        // Display the game canvas and score
        game.showScreen("gamecanvas");
        game.showScreen("scorescreen");
        // Define game objects
        game.ended = false;
        game.asteroids = [];
        game.fires = [];
        game.explosions = [];
        game.ship = {x:350,y:350,animx:0,animy:0};
        game.Timer = 0;

        game.animationFrame = window.requestAnimFrame(game.animate, game.canvas);
    },

    update: function() {

            // Increment Timer every loop
            this.Timer++;
            // Every 10th iteration creating new asteroid
            if (this.Timer % 20==0) {
                this.asteroids.push({
                    angle:0,
                    dxangle:Math.random()*0.2-0.1,
                    del:0,
                    x:Math.random()*650,
                    y:-50,
                    dx:Math.random()*2-1,
                    dy:Math.random()*2+1
                });

            }
                //Every 30th iterations creating new fire
            if (this.Timer%30==0) {
                this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:0,dy:-5.2});
                this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:0.5,dy:-5});
                this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:-0.5,dy:-5});
            }

                // Asteroids motion
            for (i in this.asteroids) {
                this.asteroids[i].x=this.asteroids[i].x+this.asteroids[i].dx;
                this.asteroids[i].y=this.asteroids[i].y+this.asteroids[i].dy;
                this.asteroids[i].angle=this.asteroids[i].angle+this.asteroids[i].dxangle;

                // Screen bounce check
                if (this.asteroids[i].x<=0 || this.asteroids[i].x>=650) this.asteroids[i].dx=-this.asteroids[i].dx;
                if (this.asteroids[i].y>=750) {
                    this.asteroids.splice(i,1);
                    this.updateScore(-3);
                }

                // Asteroids and fires collisions
                for (j in this.fires) {

                    if (Math.abs(this.asteroids[i].x+25-this.fires[j].x-15)<50 && Math.abs(this.asteroids[i].y-this.fires[j].y)<25) {
                        // Adding new explosion
                        this.explosions.push({x:this.asteroids[i].x-25,y:this.asteroids[i].y-25,animx:0,animy:0});
                        this.updateScore(1);

                        //Mark asteroid on deleting
                        this.asteroids[i].del=1;
                        this.fires.splice(j,1);
                        break;
                    }
                }
                // Deleting asteroids
                if (this.asteroids[i].del==1) this.asteroids.splice(i,1);
            }

                //Motion fires
            for (i in this.fires) {
                this.fires[i].x=this.fires[i].x+this.fires[i].dx;
                this.fires[i].y=this.fires[i].y+this.fires[i].dy;

                if (this.fires[i].y<-30) this.fires.splice(i,1);
            }

                //Animation explosions
            for (i in this.explosions) {
                this.explosions[i].animx=this.explosions[i].animx+0.5;
                if (this.explosions[i].animx>7) {this.explosions[i].animy++; this.explosions[i].animx=0}
                if (this.explosions[i].animy>7)
                    this.explosions.splice(i,1);
            }

            //Animation protecting shield
            this.ship.animx=this.ship.animx+1;
            if (this.ship.animx>4) {this.ship.animy++; this.ship.animx=0}
            if (this.ship.animy>3) {
                this.ship.animx=0; this.ship.animy=0;
            }
    },
    // Update score
    updateScore: function(score) {
        var scoreObj = document.getElementById("score");
        game.score += score;

        if(game.score < 0) {
            game.score = 0;
        }

        if(game.score !== 0 && game.score % 100 === 0) {
            scoreObj.classList.add("playAnim");
            setTimeout(() => {
                scoreObj.classList.remove("playAnim");
            }, 1500);
        }

        if(game.score !== 0 && game.score % 60 === 0) {
            game.score += 10;
        }

        scoreObj.innerHTML = "Score: " + game.score;
    },
    // Rendering objects
    animate: function() {

        game.update();
            //Clear canvas
            game.context.clearRect(0, 0, 700, 700);
            //Draw background
            game.context.drawImage(game.currentLevel.backgroundImage, 0, 0, 700, 700);
            //Draw fires
            for (i in game.fires) {
                game.context.drawImage(game.currentLevel.shot, game.fires[i].x, game.fires[i].y, 30, 30);
            }
            //Draw ship
            game.context.drawImage(game.currentLevel.ship, game.ship.x, game.ship.y);
            //Draw shield
            game.context.drawImage(game.currentLevel.shield, 192*Math.floor(game.ship.animx),192*Math.floor(game.ship.animy),192,192, game.ship.x-25, game.ship.y-25, 120, 130);
            //Draw asteroids
            for (i in game.asteroids) {
                //context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50);
                //Rotate asteroids
                game.context.save();
                game.context.translate(game.asteroids[i].x+25, game.asteroids[i].y+25);
                game.context.rotate(game.asteroids[i].angle);
                game.context.drawImage(game.currentLevel.enemy, -25, -25, 50, 50);
                game.context.restore();
                //context.beginPath();
                //context.lineWidth="2";
                //context.strokeStyle="green";
                //context.rect(aster[i].x, aster[i].y, 50, 50);
                //context.stroke();
            }
            //Draw explosions
        if(game.explosions.length !== 0) {
            for (i in game.explosions) {
                game.context.drawImage(game.currentLevel.explosion, 128*Math.floor(game.explosions[i].animx),128*Math.floor(game.explosions[i].animy),128,128, game.explosions[i].x, game.explosions[i].y, 100, 100);
            }
        }
        if (!game.ended) {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        } },
    finish: function() {
        game.ended = true;

        // Hide Screen
        game.hideScreens();
        // Display the game canvas and score
        game.showScreen("gamestartscreen");
    }
};

// Initialize game once page has fully loaded
window.addEventListener("load", function() {
    game.init();
});






































