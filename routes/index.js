import bodyParser from "body-parser";
import express from "express";
import albumRouter from '../routes/albums.js'
import bandRouter from '../routes/bands.js'

// Define the port number
const port = 3000;

// Create an Express application
const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse incoming request bodies as URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/albums', albumRouter);
app.use('/bands', bandRouter);

let title = '';

// Home page route
app.get('/', (req, res) => {
    title = "Home";
    res.render('index.ejs', {title});
})

// About Page
app.get('/about', (req, res) => {
    title = "About";
    res.render('about.ejs', {title});
})

// Handling with 404 Errors
app.use((req, res) => {
    res.status(404).render('404.ejs', {title: "404 - Not Found"});
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});