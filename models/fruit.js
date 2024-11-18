// models/fruit.js
const mongoose = require("mongoose"); // require package

// define the schema for fruit describing properties and characteristics of what the fruit object should include
// ex. property: name with data type of: string
// fruit is an array that has the properties of name and ready2eat
const fruitSchema = new mongoose.Schema({
    fruitName: String,
    isReadyToEat: Boolean,
});

// link the schema to a model to connect the defined structure to our database
const Fruit = mongoose.model("Fruit", fruitSchema); // create a collection that is called Fruit which has this restriction (fruitSchema) on it
//use capital letter for database model names (ex. Fruit, not fruit)

// export the model so we can use it in other places in our application
module.exports = Fruit;

// last step: import model into server.js file 