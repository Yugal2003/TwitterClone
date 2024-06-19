import express from 'express';
import dotenv from 'dotenv'
import mongoose, { mongo } from 'mongoose';
import userRoute from './routes/userRoute.js'
import tweetRoute from './routes/tweetRoute.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
const PORT = process.env.PORT || 9669;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connect MongoDB Successfully..."))
.catch(()=> console.log("Failed To Connect MongoDB"));

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions));

// api endpoint
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/tweet', tweetRoute)

app.listen(PORT , () =>{
    console.log(`Server Running on PORT : ${PORT}`);
})