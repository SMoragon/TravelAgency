"use strict"

const express=require("express");
const path=require("path")
const port=3000;
const app=express();

app.use(express.static(path.join(__dirname,"public")))


app.listen(port,(err)=>{
    if(err){
        console.log("An error ocurred while listening to server")
    }
    else{
        console.log(`Server listening on port http://localhost:${port} `)
    }
})
