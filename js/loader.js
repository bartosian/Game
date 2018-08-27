// Loader for assets

var loader = {
    loaded: true,
    loadedCount: 0, // Assets that have been loaded so far
    totalCount: 0, // Total number of assets that need loading
    // Init music formats support
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
        loader.soundFileExtn = mp3Support ? ".mp3" : oggSupport ? ".ogg" : undefined;
    },

    // Loader for images
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
    // Loader for music
    loadSound: function(url) {
        this.loaded = false;
        this.totalCount++;
        game.showScreen("loadingscreen");
        var audio = new Audio();
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        audio.src = url + loader.soundFileExtn;
        return audio;
    },

    // Show loading items quantity
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
