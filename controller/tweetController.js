import tweetModel from '../models/tweetSchema.js';
import userModel from '../models/userSchema.js'

const createTweet = async(req,res) =>{
    try {
        const {description,id} = req.body;
        
        if(!description || !id){
            return res.status(401).json({
                success:false,
                message:"All Fields Are Required!"
            })
        };
        // create an new tweet from user
        // const newTweet = new tweetModel({
        //     description:description,
        //     userId:id
        // });
        // await newTweet.save();
        const user = await userModel.findById(id).select('-password');
        await tweetModel.create({
            description,
            userId:id,
            userDetails : user
        })
        return res.status(200).json({
            success:true,
            message:"Tweet Create Successfully!"
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const deleteTweet = async(req,res)=>{
    try {
        const {id} = req.params;
        await tweetModel.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"Tweet Delete Successfully!"
        });
    } 
    catch (error) {
        console.log(error);    
    }
}

const likeOrDislike = async(req,res)=>{
    try {
        const loggedUserId = req.body.id;
        const tweetId = req.params.id;
        //check tweetId is present in tweetModel DB 
        const checkTweet = await tweetModel.findById(tweetId);
        if(checkTweet.like.includes(loggedUserId)){
            // already this user like (so) click to remove like 
            await tweetModel.findByIdAndUpdate(tweetId,{$pull:{like:loggedUserId}});
            return res.status(200).json({
                success:true,
                message:"User Remove liked Your Tweet!"
            })
        }
        else{
            // user like your tweet 
            await tweetModel.findByIdAndUpdate(tweetId,{$push:{like:loggedUserId}});
            return res.status(200).json({
                success:true,
                message:"User Liked Your Tweet!"
            })
        }
    } 
    catch (error) {
        console.log(error);    
    }
}

const bookmarkOrNot = async(req,res)=>{
    try {
        const loggedUserId = req.body.id;
        const tweetId = req.params.id;
        //check tweetId is present in tweetModel DB 
        const checkTweet = await tweetModel.findById(tweetId);
        if(checkTweet.bookmark.includes(loggedUserId)){
            // already this user bookmark (so) click to remove like 
            await tweetModel.findByIdAndUpdate(tweetId,{$pull:{bookmark:loggedUserId}});
            return res.status(200).json({
                success:true,
                message:"User Remove Bookmark Your Tweet!"
            })
        }
        else{
            // user bokkmark your tweet 
            await tweetModel.findByIdAndUpdate(tweetId,{$push:{bookmark:loggedUserId}});
            return res.status(200).json({
                success:true,
                message:"User Bookmark Your Tweet!"
            })
        }
    } 
    catch (error) {
        console.log(error);    
    }
}


const getAllTweetInForYouSectionOfFeed = async(req,res) => {
    try {
        const userid = req.params.id;
        const loggedUserId = await userModel.findById(userid); // check user is login or not
        const loggedUserIdTweets = await tweetModel.find({userId : userid}); // get all tweets from logging user only
        const followingAllUserTweets = await Promise.all(loggedUserId.following.map((otherUser) => {
            return tweetModel.find({userId:otherUser});
        }));
        return res.status(200).json({
            tweets_length : loggedUserIdTweets.concat(...followingAllUserTweets).length,
            tweets : loggedUserIdTweets.concat(...followingAllUserTweets),
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const getFollowingTweets= async(req,res) => {
    try {
        const userid = req.params.id;
        const loggedUserId = await userModel.findById(userid); // check user is login or not
        const followingAllUserTweets = await Promise.all(loggedUserId.following.map((otherUser) => {
            return tweetModel.find({userId:otherUser});
        }));
        return res.status(200).json({
            tweets_length : [].concat(...followingAllUserTweets).length,
            tweets : [].concat(...followingAllUserTweets),
        })
    } 
    catch (error) {
        console.log(error);    
    }
}

const tweetController = {
    createTweet,deleteTweet,likeOrDislike,bookmarkOrNot,getAllTweetInForYouSectionOfFeed,getFollowingTweets
}
export default tweetController;