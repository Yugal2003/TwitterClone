import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        required : true
    },
    like:{
        type:Array,
        default:[]
    },
    bookmark:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "userModel"
    },
    userDetails:{
        type:Array,
        default:[]
    },
},{timestamps:true});

const tweetModel = mongoose.model("Tweet", tweetSchema);

export default tweetModel;