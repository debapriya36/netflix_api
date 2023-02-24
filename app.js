const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const PORT=8000 || process.env.PORT;
const URI=process.env.NEW_URI;


//routing
app.use(require('./routes/show'));



//404 page
app.use((req,res,next)=>{
    res.status(404).json({
        err : "404 Page not found"
    });
    next();
})


mongoose.set('strictQuery',false);
mongoose.connect(URI);
mongoose.connection.on('connected',(result)=>{
     app.listen(PORT,()=>{
        console.log('Server is connected to mongoDB and running on port '+PORT);
     })
})
mongoose.connection.on('error',(err)=>{
    console.log(err);
})
