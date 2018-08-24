// Mouse object to handle events
var mouse = {
    init: function() {
        var canvas = document.getElementById("gamecanvas");
        canvas.addEventListener("mousemove",
            mouse.mousemovehandler, false);
    },
    mousemovehandler: function(ev) {
        game.ship.x=event.offsetX-25;
        game.ship.y=event.offsetY-13;
    }
};