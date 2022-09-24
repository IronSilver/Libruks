const express = require("express");

const app = express();

const config = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost",
}

//servir contenido estatico
app.use(express.static(__dirname + "/public"));

app.use("styles", express.static(__dirname + "/public/styles"));
app.use("src", express.static(__dirname + "/public/src"));

//rutas
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(config.port, config.host, () => {
    console.log(`Server started on http://${config.host}:${config.port}`);
});