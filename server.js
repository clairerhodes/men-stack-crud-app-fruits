// import modules
// install packages that we want to use: express, ejs, mongoose, dotenv
// load express
const express = require('express');
const app = express();

// load environment
const dotenv = require('dotenv'); // require package
dotenv.config() // loads environment variables from .env file

// require and connect to mongoose
const mongoose = require("mongoose"); // require package
// console.log(process.env.MONGODB_URI) // show mongodb connection link on console just to make sure it works
mongoose.connect(process.env.MONGODB_URI) // connect to mongoose using the connecction string in my .env file
// show that we have connected to mongoose in terminal upon start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`) // shows database name that we are connected to: MongoDB fruits
})

const methodOverride = require('method-override'); // require middleware
const morgan = require("morgan"); // new
// tell express that user is sending data from form so expect that format (using middleware: urlencoded)
app.use(express.urlencoded({ extended: false })); // expects data to be coming in from a form, gives us access to req.body
app.use(methodOverride("_method")) // whatever you call inside () here (ex. _method) is going to be a query param on our show.ejs page
app.use(morgan("dev")); //new

// import our fruit model after we connect to mongoose
const Fruit = require("./models/fruit.js"); // require specific fruit.js file, not a package like above!








// --------------------------------------- app routes --------------------------------------- //
// route to home page & connect index.ejs
app.get("/", async (req, res) => {
    res.render("home.ejs"); // send index page to our home route
});

// GET /fruits
// use GET to show us all of our fruits
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find(); // retrieve data from Fruit collection
    res.render('fruits/index.ejs', { // variable name: fruits corresponds to a key inside my object: 
        // fruits: yummy // shoes yummy on my fruits page
        fruits: allFruits,
    }); // show my all fruits index page

});

// POST /fruits
// use POST route to create form data // handles processing of the data and shows data after using redirect
app.post('/fruits', async (req, res) => {
    // console.log(req.body); // req.body is something that is created when we do our post function
    if(req.body.isReadyToEat === 'on') { // if box is checked, property isReadyToEat is set to true instead of 'on' now
        req.body.isReadyToEat = true
    } else { // if box is not checked, show property isReadyToEat set to false (show up in browser)
        req.body.isReadyToEat = false
    }
    // now we have an object (our data) that matches our database, pass that information into fruit.create (adding a new fruit to our list)
    await Fruit.create(req.body); // send info back to our database once the data is provided
    // res.send(req.body);
    res.redirect('/fruits') // redirect user back to index route so they can see the all fruits in the list after creation
})

// construct /fruits/new route that displays a form for entering fruit data
app.get("/fruits/new", async (req, res) => {
    // res.send("The route sends the user a form page!"); // testing our new route
    res.render('fruits/new.ejs'); // send new fruit form to our new route
});

// make a SHOW route to look up a specific fruit by id
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit =  await Fruit.findById(req.params.fruitId);
    // res.send(`This route renders the show page for fruit id: ${foundFruit}!`);
    res.render('fruits/show.ejs', { fruit: foundFruit }); // 
});

// create delete route to delete specific fruit page
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    // res.send(req.params.fruitId);
    res.redirect('/fruits');
});

// create an edit route (can go anywhere!)
// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    // res.send('edit page');
    const foundFruit = await Fruit.findById(req.params.fruitId); // get specific fruit using ID
    res.render('fruits/edit.ejs', { fruit: foundFruit});
});

// create a PUT method to update a fruit (can go anywhere bc only PUT method in js file)
// forms need to use PUT requests
app.put('/fruits/:fruitId', async (req, res) => {
    // format checkbox data into a boolean instead of on/off
    if(req.body.isReadyToEat === 'on') { // if box is checked, property isReadyToEat is set to true instead of 'on' now
        req.body.isReadyToEat = true
    } else { // if box is not checked, show property isReadyToEat set to false (show up in browser)
        req.body.isReadyToEat = false
    }
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body); // tell it what to update in the database and pass in req.body
    // res.send(req.body);
    res.redirect(`/fruits`);
});

// listen at the bottom of our app!
app.listen(3001, () => {
    console.log("Listening on port 3001");
});