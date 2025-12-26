const express = require("express");
const app = express();
const router = express.Router();

app.use("/",router);

// router.get("/api",getHome);
// router.get("/get/:id", getid);
 
function getuser(reg,res){
    console.log("Get user called");
    res.send("User fetched successfully");
}
router.get("/get",getuser);

app.listen(5000, ()=> {
    console.log("Server running on port 5000");
})