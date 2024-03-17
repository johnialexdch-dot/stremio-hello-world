const { addonBuilder } = require("stremio-addon-sdk");

const subtitles_module = require('./lib/subtitles_from_buffer') //<<<<<<<< Load Subs from Buffer
// const subtitles_module = require('./lib/subtitles_from_file')      //<<<<<<<< Load Subs from File

const fs = require('fs');

const METAHUB_URL = "https://images.metahub.space"

const manifest = {
    "id": "org.stremio.subtitles_encoding_issue",
    "version": "1.0.0",
    "name": "Subtitles Encoding Issues",
    "description": "Addon for subtitles-encoding issues",
    "resources": ["subtitles"],
    "types": [
        "movie", 
        "series"
    ],
    "catalogs": [],
    "idPrefixes": ["tt"]

};

const builder = new addonBuilder(manifest);

builder.defineSubtitlesHandler(function (args) {

    defineSubtitlesHandler_output = Promise.resolve(subtitlesHandler());
    return defineSubtitlesHandler_output

})

async function subtitlesHandler() {

    const subtitles_output = await subtitles_module.subtitles_start()
    return { subtitles: subtitles_output }

}


module.exports = builder.getInterface()