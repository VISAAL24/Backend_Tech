const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();

const url = "mongodb://localhost:27017/Backend";


app.use(express.json()); //middleware

//MongoDB connection
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

// business logic -> (CRUD Operation)
router.post("/", async(req,res)=>{
    try{
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get("/", async (req,res) => {
    try{
        const person = await Person.find();
        res.status(200).json(person);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get("/:rollno", async (req,res)=>{
    try{
        const person = await Person.findOne({Roll_no: Number(req.params.rollno)});
        if(!person){
            return res.status(404).json({message:"Person not found"});
        }
        res.status(200).json(person);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
})

router.delete("/:rollno", async (req,res)=>{
    try{
        const deletedPerson = await Person.findOneAndDelete({
            Roll_no: Number(req.params.rollno)
        });
        if(!deletedPerson){
            return res.status(404).json({message:"Person not found"});
        }
        res.status(200).json({message:"Person deleted successfully", deletedPerson});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
})

router.put("/:rollno",async(req,res)=>{
    try{
        const updatePerson = await Person.findOneAndUpdate(
            {Roll_no:Number(req.params.rollno)},
            req.body,
            {new: true, runValidators: true}
        );
        if(!updatePerson){
            return res.status(404).json({message:"Person not found"});
        }
        res.json(updatePerson);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

app.use("/persons",router);

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});