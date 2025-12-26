const express = require("express");
const app = express();
const PORT = 3000; 

app.use(express.json());//Required for post

const data =[{
    name:"John",
    age:34,
    email:"john23@gmail.com"
},{
    name:"Ram",
    age:24,
    email:"rama2@gmail.com"
},{
    name:"senthil",
    age:21,
    email:"senthil3@gmail.com"
},{
    name:"vijay",
    age:22,
    email:"vijay4@gmail.com"
}]



app.post("/",(req,res)=>{
    //res.send("Hello world");
    const {name, age, email} = req.body;
    const user = {name, age, email};
    data.push(user);

    res.json(data);
})

app.get("/",(req,res)=>{
    //res.send("Hello world");
    res.json(data);
})

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});