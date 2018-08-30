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
        game.complexityControl;
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
        let sound = new Audio();
        sound.src = "sounds/buttonPres.mp3";
        sound.play();
        console.log(game.startSound);
        game.startSound.pause();
        game.startSound.currentTime = 0;
        game.hideScreens();
        game.showScreen("levelselectscreen");
         sound.currentTime = 0;
        var rulesDivLeft = document.getElementById("leftDiv");
        var rulesDivRight = document.getElementById("rightDiv");
        setTimeout(() => {
            rulesDivLeft.classList.add("left");
            rulesDivRight.classList.add("right");
            let sound = new Audio();
            sound.src = "sounds/sweep.mp3";
            sound.play();


        }, 100);

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
        game.shields = [];
        game.ship = {x:350,y:350,animx:0,animy:0};
        game.Timer = 0;
        game.counterAster = game.complexityControl ? game.complexityControl : 50;
        game.speedFire = 30;
        game.cartridges = [];
        game.asterTotal = 0;
        game.satellites = [];
        game.animationFrame = window.requestAnimFrame(game.animate, game.canvas);
    },

    update: function() {
            // Increment Timer every loop
            this.Timer++;
            // Checking total asteroid count
            if(this.asterTotal === this.currentLevel.limit) {
                this.finish("endingscreen", "You win!");
            }
            // Every 10th iteration creating new asteroid
            if (this.Timer % this.counterAster == 0) {
                this.asteroids.push({
                    angle:0,
                    dxangle:Math.random()*0.2-0.1,
                    del:0,
                    x:Math.random()*650,
                    y:-50,
                    dx:Math.random()*2-1,
                    dy:Math.random()*2+1
                });
                this.asterTotal++;
            }

            if(this.Timer % 220 === 0) {
                if((this.counterAster - 1)  > 0) {
                    this.counterAster--;
                }
            }

        //Every 30th iterations creating new fire
            if (this.Timer % this.speedFire == 0) {
                game.currentLevel.sounds.shotSound.volume = 0.4;
                game.currentLevel.sounds.shotSound.play();
                this.currentLevel.weapons > 2 ? this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:0,dy:-5.2}) : null;
                this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:0.5,dy:-5});
                this.fires.push({x:this.ship.x+22,y:this.ship.y,dx:-0.5,dy:-5});
                game.currentLevel.sounds.shotSound.currentTime = 0;
            }

        //Every 1800th iterations creating new shield
        if (this.Timer%2500==0) {
            console.log(this.asterTotal);
            this.shields.push({
                angle: 0,
                dxangle:Math.random()*0.2-0.1,
                del:0,
                x:Math.random()*650,
                y:-50,
                dx:Math.random()*2-1,
                dy:Math.random()*2+1
            });
        }

        //Every 1200th iterations creating new box with cartridges
        if (this.Timer%1300==0) {
            this.cartridges.push({
                angle: 0,
                dxangle:Math.random()*0.2-0.1,
                del:0,
                x:Math.random()*650,
                y:-50,
                dx:Math.random()*2-1,
                dy:Math.random()*2+1
            });
        }

        //Every 3000th iterations creating new satellite
        if (this.Timer%3000==0) {
            this.satellites.push({
                angle: 0,
                dxangle:Math.random()*0.05,
                del:0,
                x:Math.random()*650,
                y:-50,
                dx:Math.random()*2-1,
                dy:Math.random()*2+1,
                armourBounce: 6
            });
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
                    this.updateScore(-1);
                }

                // Asteroids and fires collisions
                for (j in this.fires) {

                    if (Math.abs(this.asteroids[i].x+25-this.fires[j].x-15)<50 && Math.abs(this.asteroids[i].y-this.fires[j].y)<25) {
                        // Adding new explosion
                        game.currentLevel.sounds.explosion.play();
                        this.explosions.push({x:this.asteroids[i].x-25,y:this.asteroids[i].y-25,animx:0,animy:0});
                        this.updateScore(1);
                        game.currentLevel.sounds.explosion.currentTime = 0;

                        //Mark asteroid on deleting
                        this.asteroids[i].del=1;
                        this.fires.splice(j,1);
                        break;
                    }
                }

                if (this.asteroids[i].del==1) this.asteroids.splice(i,1);

            }

        // Shields motion
        for (h in this.shields) {
            this.shields[h].x=this.shields[h].x+this.shields[h].dx;
            this.shields[h].y=this.shields[h].y+this.shields[h].dy;
            this.shields[h].angle=this.shields[h].angle+this.shields[h].dxangle;

            // Screen bounce check
            if (this.shields[h].x<=0 || this.shields[h].x>=650) this.shields[h].dx=-this.shields[h].dx;
            if (this.shields[h].y>=750) {
                this.shields.splice(h,1);
            }

            // Shields and ship collisions
                if (Math.abs(this.shields[h].x+25-this.ship.x-35)< 65 && Math.abs(this.shields[h].y-this.ship.y)<50) {
                    game.currentLevel.sounds.bonus.play();
                    //Mark shield on deleting
                    this.shields[h].del=1;
                    if(this.currentLevel.shieldBounce < 3) {
                        this.currentLevel.shieldBounce++;
                    }
                    game.currentLevel.sounds.bonus.currentTime = 0;
            }

            if (this.shields[h].del==1) this.shields.splice(h,1);

        }

        // Cartridges motion
        for (n in this.cartridges) {
            this.cartridges[n].x=this.cartridges[n].x+this.cartridges[n].dx;
            this.cartridges[n].y=this.cartridges[n].y+this.cartridges[n].dy;
            this.cartridges[n].angle=this.cartridges[n].angle+this.cartridges[n].dxangle;

            // Screen bounce check
            if (this.cartridges[n].x<=0 || this.cartridges[n].x>=650) this.cartridges[n].dx=-this.cartridges[n].dx;
            if (this.cartridges[n].y>=750) {
                this.cartridges.splice(n,1);
            }

            // Cartridges and ship collisions
            if (Math.abs(this.cartridges[n].x+25-this.ship.x-35)< 65 && Math.abs(this.cartridges[n].y-this.ship.y)<50) {
                game.currentLevel.sounds.bonus.play();
                //Mark cartridges on deleting
                this.cartridges[n].del=1;
                if(this.speedFire === 30) {
                    this.speedFire = 10;

                    setTimeout(() => {
                        game.speedFire = 30;
                    }, 5000);
                    game.currentLevel.sounds.bonus.currentTime = 0;
                }
            }

            if (this.cartridges[n].del==1) this.cartridges.splice(n,1);

        }

        // Satellites motion
        for (z in this.satellites) {
            this.satellites[z].x=this.satellites[z].x+this.satellites[z].dx;
            this.satellites[z].y=this.satellites[z].y+this.satellites[z].dy;
            this.satellites[z].angle=this.satellites[z].angle+this.satellites[z].dxangle;

            // Screen bounce check
            if (this.satellites[z].x<=0 || this.satellites[z].x>=650) this.satellites[z].dx=-this.satellites[z].dx;
            if (this.satellites[z].y>=750) {
                this.cartridges.splice(z,1);
            }

            // Satellites and fires collisions
            for (a in this.fires) {

                if (Math.abs(this.satellites[z].x+40-this.fires[a].x-15)<65 && Math.abs(this.satellites[z].y-this.fires[a].y)<35) {
                    // Adding new explosion
                    this.explosions.push({x:this.satellites[z].x-35,y:this.satellites[z].y-35,animx:0,animy:0});

                    if(this.satellites[z].armourBounce > 2) {
                        this.satellites[z].armourBounce--;
                    } else {
                        //Mark satellites on deleting
                        this.satellites[z].del=1;
                        this.updateScore(-30);
                    }
                    this.fires.splice(a,1);
                    break;
                }
            }

            if (this.satellites[z].del==1) this.satellites.splice(z,1);
        }

        for (k in this.asteroids) {

            // Asteroids and ship collisions
            if (Math.abs(this.asteroids[k].x + 25 - this.ship.x - 35) < 60 && Math.abs(this.asteroids[k].y - this.ship.y) < 35) {
                // Adding new explosion
                game.currentLevel.sounds.explosion.play();
                this.explosions.push({x: this.asteroids[k].x - 25, y: this.asteroids[k].y - 25, animx: 0, animy: 0});

                if(this.currentLevel.shieldBounce > 0) {
                    this.currentLevel.shieldBounce--;
                } else if(this.currentLevel.armourBounce > 0){
                    this.currentLevel.armourBounce--;

                    if(this.currentLevel.armourBounce === 0) {
                        this.finish("endingscreen", "You lose!");
                    }
                }
                game.currentLevel.sounds.explosion.currentTime = 0;
                //Mark asteroid on deleting
                this.asteroids[k].del = 1;
                break;
            }

            // Deleting asteroids
            if (this.asteroids[k].del == 1) this.asteroids.splice(k, 1);
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
            game.currentLevel.sounds.score.play();
            scoreObj.classList.add("playAnim");
            setTimeout(() => {
                scoreObj.classList.remove("playAnim");
            }, 1500);
            game.currentLevel.sounds.score.currentTime = 0;
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
            game.currentLevel.shieldBounce > 0 ? game.context.drawImage(game.currentLevel.shield, 192*Math.floor(game.ship.animx),192*Math.floor(game.ship.animy),192,192, game.ship.x-25, game.ship.y-25, 120, 130): null;

            //Draw asteroids
            for (i in game.asteroids) {
                //Rotate asteroids
                game.context.save();
                game.context.translate(game.asteroids[i].x+25, game.asteroids[i].y+25);
                game.context.rotate(game.asteroids[i].angle);
                game.context.drawImage(game.currentLevel.enemy, -25, -25, 50, 50);
                game.context.restore();
            }

        //Draw shields
        for (s in game.shields) {
            //Rotate shields
            game.context.save();
            game.context.translate(game.shields[s].x+25, game.shields[s].y+25);
            game.context.rotate(game.shields[s].angle);
            game.context.drawImage(game.currentLevel.shieldIcon, -25, -25, 50, 50);
            game.context.restore();
        }

        //Draw cartridges
        for (m in game.cartridges) {
            //Rotate shields
            game.context.save();
            game.context.translate(game.cartridges[m].x+25, game.cartridges[m].y+25);
            game.context.rotate(game.cartridges[m].angle);
            game.context.drawImage(game.currentLevel.box, -25, -25, 50, 50);
            game.context.restore();
        }

        //Draw satellites
        for (q in game.satellites) {
            //Rotate shields
            game.context.save();
            game.context.translate(game.satellites[q].x+25, game.satellites[q].y+25);
            game.context.rotate(game.satellites[q].angle);
            game.context.drawImage(game.currentLevel.friend, -25, -25, 70, 70);
            game.context.restore();
        }
            //Draw explosions
        if(game.explosions.length !== 0) {
            for (i in game.explosions) {
                game.context.drawImage(game.currentLevel.explosion, 128*Math.floor(game.explosions[i].animx),128*Math.floor(game.explosions[i].animy),128,128, game.explosions[i].x, game.explosions[i].y, 100, 100);
            }
        }
            //Draw life and shield
        for(var i = 0; i < game.currentLevel.armourBounce; i++) {
            game.context.drawImage(game.currentLevel.life, 540 + i * 25, 10, 20, 20);
        }

        for(var i = 0; i < game.currentLevel.shieldBounce; i++) {
            game.context.drawImage(game.currentLevel.shieldIcon, 540 + i * 30, 120, 25, 25);
        }
        //Check if game ended
        if (!game.ended) {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        } },
    finish: function(screen, message) {
        game.ended = true;

            if(message) {

                if(message === "You lose!") {
                    game.currentLevel.sounds.lose.play();
                    setTimeout(() => {

                        ga
                    }, 2000);

                } else if(message === "You win!") {
                    game.currentLevel.sounds.win.play();
                    game.currentLevel.sounds.win.currentTime = 0;

                }


                var divMes = document.getElementById("levelMessage");
                divMes.innerHTML = message;
                divMes.classList.add("appear-message");

                setTimeout(()=> {
                    // Hide Screen
                    game.hideScreens();
                    // Display the game canvas and score
                    screen ? game.showScreen(screen) : game.showScreen("gamestartscreen");
                    divMes.classList.remove("appear-message");
                    var endScoreVal = document.getElementById("endScoreVal");
                    endScoreVal.innerHTML = game.score;

                    game.hideScreens();
                    // Display the game canvas and score
                    screen ? game.showScreen(screen) : game.showScreen("gamestartscreen");
                }, 3000);
            } else {
                var endScoreVal = document.getElementById("endScoreVal");
                endScoreVal.innerHTML = game.score;

                game.hideScreens();
                // Display the game canvas and score
                screen ? game.showScreen(screen) : game.showScreen("gamestartscreen");
            }

    }
};

// Initialize game once page has fully loaded
window.addEventListener("load", function() {
    game.startSound = new Audio();
    game.startSound.src = "sounds/start.mp3";
    game.startSound.play();
    game.startSound.loop = true;
    game.init();
});






































