import mongoose, { Schema } from "mongoose";

const postsSchema = new Schema({
    postText:{
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{
        type:Number,
        default:0,
    }],
    // likes:{
    //     default:[],
    // },
    // comments:{
    //     type:String,
    // },
}, {timestamps:true});

export const Post = mongoose.model("Post", postsSchema);