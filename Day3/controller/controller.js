const express = require("express");
const app = express();
const router = express.Router();

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
