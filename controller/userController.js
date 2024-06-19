import userModel from '../models/userSchema.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const register = async (req,res) =>{
    try {
        const {name,username,email,password} = req.body;
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                success:false,
                message: "All Fields Are Required!"
            })
        }
        // check email is already in DB
        const checkUser = await userModel.findOne({email:email});
        if(checkUser){
            return res.status(401).json({
                success:false,
                message: "Email Already Register here!"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            username:username,
            email:email,
            password:hashPassword
        })
        console.log("newUser" , newUser);
        await newUser.save();
        
        return res.status(200).json({
            success:true,
            message: "Account Created Successfully!"
        })
    } 
    catch (error) {
        res.status(401).json({
            success : false,
            message : "Failed to Register"
        })    
    }
}

const login = async(req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"All Fields Are Required!"
            })
        };

        const user = await userModel.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Email Is Not Register Here!"
            })
        }
        // password check
        const isMatchPass = await bcrypt.compare(password,user.password);
        if(!isMatchPass){
            return res.status(401).json({
                success:false,
                message:"Email OR Password Not Match!"
            })
        };

        //pass token
        const token = jwt.sign({userId:user._id}, process.env.SECRET_TOKEN, {expiresIn : "20d"});
        return res.status(201).cookie("token",token, {expiresIn:"20d" ,httpOnly : true}).json({
            success:true,
            message:`Welcome ${user.name}`,
            user,
            token:token
        })
    } 
    catch (error) {
        console.log(error);
        res.status(401).json({
            success : false,
            message : "Failed to Login"
        }) 
    }
}

const logout = async(req,res)=>{
    return res.cookie("token", "", {expiresIn : new Date(Date.now()) }).json({
        success:true,
        message:"User Logout Successfully"
    })
}

const bookmark = async(req,res)=>{
    try {
        const loggedUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await userModel.findById(loggedUserId);
        if(user.bookmarks.includes(tweetId)){
            await userModel.findByIdAndUpdate(loggedUserId, {$pull : { bookmarks: tweetId}});
            return res.status(200).json({
                success:true,
                message:"Removed From Bookmarks!"
            })
        }
        else{
            await userModel.findByIdAndUpdate(loggedUserId, {$push : {bookmarks:tweetId}});
            return res.status(200).json({
                success:true,
                message:"Save To Bookmarks!"
            })
        }
    } 
    catch (error) {
        console.log(error);    
    }
}

const getProfile = async(req,res) =>{
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select('-password');
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Not Found!"
            })
        }
        return res.status(200).json({
            user
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const getOtherUsers = async(req,res)=>{
    try {
        const id = req.params.id;
        const otherUser = await userModel.find({_id:{$ne:id}}).select('-password');

        if(!otherUser){
            return res.status(401).json({
                success:false,
                message: "Currenlty No User Found!"
            })
        };
        return res.status(200).json({
            OtherUser_Length : otherUser.length,
            OtherUser : otherUser
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const follow = async(req,res)=>{
    try {
        const loggedUserId = req.body.id;
        const userId = req.params.id;
        const logUser = await userModel.findById(loggedUserId);
        const user = await userModel.findById(userId);

        if(!user.followers.includes(loggedUserId)){
            await user.updateOne({$push : {followers : loggedUserId}});
            await logUser.updateOne({$push : {following : userId}});
        }
        else{
            return res.status(400).json({
                message:`${logUser.name} Already Followed To ${user.name}`
            })
        };

        return res.status(200).json({
            success:true,
            message:`${logUser.name} follow to ${user.name}`
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const unFollow = async(req,res)=>{
    try {
        const loggedUserId = req.body.id;
        const userId = req.params.id;
        const logUser = await userModel.findById(loggedUserId);
        const user = await userModel.findById(userId);

        if(logUser.following.includes(userId)){
            await user.updateOne({$pull : {followers : loggedUserId}});
            await logUser.updateOne({$pull : {following : userId}});
        }
        else{
            return res.status(400).json({
                message:`User has not Followed Yet!`
            })
        };

        return res.status(200).json({
            success:true,
            message:`${logUser.name} Unfollow to ${user.name}`
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const userController = {
    register,login,logout,bookmark,getProfile,getOtherUsers,follow,unFollow
}

export default userController;