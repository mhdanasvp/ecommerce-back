const express = require('express');
const morgan=require("morgan")
const createError=require("http-errors")
const cookieParser=require("cookie-parser")

const app=express()

// requring routes
const auth=require("./routes/auth")
const user=require("./routes/user")
const category=require("./routes/category")
const product=require("./routes/product")



// requring
require('dotenv').config();
require("./helpers/initMongodb")



// middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// route middleware
app.use("/api/auth",auth)
app.use("/api/user",user)
app.use("/api/category",category)
app.use("/api/product",product)

app.use(async(req,res,next)=>{
    next(createError.NotFound())
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message: err.message
        }
    })
})

// running server
const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`server running on ${PORT}`))