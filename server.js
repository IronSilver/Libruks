const express = require("express");
const fs = require("fs").promises;
const formidable = require("formidable");

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

//ruta de administrador para subir imágenes
app.get("/upload", (req, res)=>{
    res.sendFile(`${__dirname}/private/upload.html`);
})

app.post("/upload", (req, res)=>{
    const form = formidable();

    form.parse(req, (err, fields, files)=>{
        let imgPath = fields.path;
        if(err){
            res.send(err);
        }

        
        //si la imagen se envía, esta se almacena
        if(files.portada.size != 0){ 
            const oldPath = files.portada.filepath;
            const newPath = __dirname + "/public/src/images/portadas/"+fields.path;
            fs.rename(oldPath, newPath);
        }
        
        //leer y almacenar en books.json
        fs.readFile(`${__dirname}/private/books.json`, {encoding: "utf-8"}).then((data)=>{
            let books = JSON.parse(data);


            //creación de los datos del libro subido
            const currentBook = {
                title: fields.title,
                image: `portadas/${imgPath}`,
                author: fields.author,
                year: fields.year,
                labels: ["comedia", "romantico"]
            }
            //se almacena y sube dicho libro
            books.push(currentBook);

            fs.writeFile(`${__dirname}/private/books.json`, JSON.stringify(books)).then(()=>{
                res.send(`
                    <h2>Libro subido con éxito!</h2>
                    ${JSON.stringify(currentBook)}
                `)
            })

        });
    })
})


app.listen(config.port, config.host, () => {
    console.log(`Server started on http://${config.host}:${config.port}`);
});