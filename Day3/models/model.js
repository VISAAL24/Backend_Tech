const mongoose = require("mongoose");

mongoose.connect(url)
    .then(() => console.log("Mongo DB connected")) //if ok
    .catch(err => console.log(err));

const personSchema = new mongoose.Schema({
    Roll_no: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

const Person = mongoose.model("PersonFinal",personSchema);