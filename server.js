const express = require("express");
const fs = require("fs").promises;

const app = express();

const config = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost",
}

//servir contenido estatico
app.use(express.static(__dirname + "/public"));

app.use("styles", express.static(__dirname + "/public/styles"));
app.use("src", express.static(__dirname + "/public/src"));
app.use("/portadas", express.static(__dirname + "/public/src/images/portadas"))

//especificar el motor de plantilla
app.set("view engine", "ejs");



//rutas 
/**
 * Por ahora van a aparecer todos los libros
 */
app.get("/", (req, res) => {
    fs.readFile(`${__dirname}/private/books.json`, {encoding: "utf-8"}).then((data)=>{
        const books = JSON.parse(data);

        res.render("index", {
            books
        })    
    })
    
});

app.listen(config.port, config.host, () => {
    console.log(`Server started on http://${config.host}:${config.port}`);
});