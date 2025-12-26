const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    password: {
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

// JWT secret (use env var in production)
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Authentication Middleware - Define before routes that use it
const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Authorization header missing"});
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Token not provided"});
    }

    try{
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch(err){
        res.status(401).json({message: "Invalid or expired token"});
    }
};

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

router.delete("/:rollno", authMiddleware, async (req,res)=>{
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

app.post("/login", async(req,res)=>{
    try{
        const {Roll_no, password} = req.body;
        const user = await Person.findOne({Roll_no});
        if(!user){
            return res.status(401).json({message: "User not found"});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid password"});
        }
        
        const token = jwt.sign({Roll_no}, JWT_SECRET, {expiresIn: "1h"});
        res.json({message: "Login successful", token});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

app.post("/register",async (req,res)=>{
    try{
        const {Roll_no, name,password,age,city}=req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const person = new Person({
            Roll_no,
            name,
            password: hashedPassword,
            age,
            city
        });
        await person.save();
        res.status(201).json({message: "Registered successfully"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.put("/:rollno", authMiddleware, async(req,res)=>{
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

app.use("/persons", router);

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});

// JWT Authentication Flow:
// 1. POST /register - Register new user with encrypted password
// 2. POST /login - Login with Roll_no and password, get JWT token
// 3. GET /persons - Get all persons (public)
// 4. GET /persons/:rollno - Get specific person (public)
// 5. PUT /persons/:rollno - Update person (protected - requires token)
// 6. DELETE /persons/:rollno - Delete person (protected - requires token)
// 
// Protected routes require: Authorization: Bearer <token>