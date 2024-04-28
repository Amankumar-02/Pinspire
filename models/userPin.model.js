import mongoose, { Schema } from "mongoose";

const userPinSchema = new Schema({
    userPinTitle: {
        type:String,
        required:true,
    },
    pinCover: {
        type:String,
    },
    userPin: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    userPostPin: [{
        type:Schema.Types.ObjectId,
        ref: 'Post',
    }],
}, {timestamps:true});

export const UserPin = mongoose.model("UserPin", userPinSchema)