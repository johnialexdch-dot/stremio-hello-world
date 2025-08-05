// const { serveHTTP } = require("stremio-addon-sdk");

// const addonInterface = require("./addon");
// serveHTTP(addonInterface, { port: 7001 });


////////////////////////////


const express = require("express");
const { getRouter } = require("stremio-addon-sdk");
const path = require("path");

const addonInterface = require("./01_login/addon");
serveHTTP(addonInterface, { port: process.env.PORT || 7000 });

const app = express();
const PORT = process.env.PORT || 7000;;

// Serve the /configure page
app.get("/configure", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Ensure the file exists in the "public" folder
});

// Use the Stremio Addon Router
const addonRouter = getRouter(addonInterface);
app.use("/", addonRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Addon running at http://127.0.0.1:${PORT}/manifest.json`);
});

