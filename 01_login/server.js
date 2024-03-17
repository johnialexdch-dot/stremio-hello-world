const { serveHTTP } = require("stremio-addon-sdk");

const addonInterface = require("./addon");
serveHTTP(addonInterface,  { port: process.env.PORT || 7000 });

console.log(`Started addon at: http://localhost:${process.env.PORT || 7001}/manifest.json`);
