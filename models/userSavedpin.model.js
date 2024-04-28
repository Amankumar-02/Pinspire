import mongoose, { Schema } from "mongoose";

const userSavedPinSchema = new Schema({
    userSavedPinTitle: {
        type:String,
        required:true,
    },
    userSavedPin: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    userSavedPostPin: [{
        type:Schema.Types.ObjectId,
        ref: 'Post',
    }],
}, {timestamps:true});

export const UserSavedPin = mongoose.model("UserSavedPin", userSavedPinSchema)