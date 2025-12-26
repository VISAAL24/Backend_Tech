const express = require("express");
const app = express();
const PORT = 3000; 

app.use(express.json());//Required for post

const data =[{
    id:1,
    name:"John",
    age:34,
    email:"john23@gmail.com"
},{
    id:2,
    name:"Ram",
    age:24,
    email:"rama2@gmail.com"
},{
    id:3,
    name:"senthil",
    age:21,
    email:"senthil3@gmail.com"
},{
    id:4,
    name:"vijay",
    age:22,
    email:"vijay4@gmail.com"
}]

let nextdata = 5;

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
+
app.get("/all/:id",(req,res)=>{
    //res.send("Hello world");
    const {id}=req.params;
    const ondata = data.find(num=>num.id==id);
    // const {name}=req.params;
    // const ondata = data.find(num=>num.name==name);
    // if(!ondata){
    //     return res.json({message:"Data not found"});
    // }
    res.json(ondata);
})

app.post("/ndata",(req,res)=>{
     const {name, age, email} = req.body;
     const postdata={
        id:nextdata++,
        name,age:parseInt(age),email
     }
     data.push(postdata);
     res.json(data);
})

app.delete('/alldata/:id',(req,res)=>{
    const {id}=req.params;
    data = data.filter(u => u.id == id);
    res.status(204).json(data);
})

app.put("/aldata/:id", (req,res)=>{
    const userId = parseInt(req.params.id);
    const {name, age, email} = req.body;
    const index = data.findIndex(u => u.id === userId);

    data[index] = {
        id:userId,
        name,age : age === "" ? null : parseInt(age),
        email
    };
    res.status(200).json(data[index]);
})

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});