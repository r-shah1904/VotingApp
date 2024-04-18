// Global Constants
const express = require("express");
const PORT = 5000;
const clientPORT = 3000;
const app = express(); 
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userModel = require("./Models/userModel")
const cors = require('cors')
let loggedIn = 0;
// Connect Database
mongoose.connect("mongodb://127.0.0.1:27017/userData")
.then(()=>{console.log("Database Connected")})
.catch((err)=>{console.log("Cannot connect to the database: "+err)})
//MiddleWares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())
app.get("/", (req, res)=>{
    res.end("Server Home")
})

async function HandleLogin(req, res){
    const {username,email, password} = req.body;
    const user = await userModel.findOne({username, email, password});
    let responseCode;
    if(!user){
        console.log("Login Error");
        responseCode = 1;
    }else{
        console.log("Logged In")
        responseCode = 0;
    }
    res.json({responseCode, username, email, password}) // responding with the json object containing the response code
}

app.post("/register", (req, res)=>{
    const {username, email ,password} = req.body;
    const newUser = new userModel({username, email, password});
    newUser.save()
    .then(() => {
        res.status(201).send("User registered successfully");
    })
    .catch(err => {
        console.error("Error registering user:", err);
        res.status(500).send("Error registering user");
    });
});

app.post("/login", HandleLogin);

app.listen(PORT, ()=>{console.log(`Server started at PORT:${PORT}`)})