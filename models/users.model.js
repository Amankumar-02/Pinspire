import mongoose, { Schema } from "mongoose";
import plm from 'passport-local-mongoose';

const usersSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        // required:true,
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref: 'Post',
    }],
    pins:[{
        type:Schema.Types.ObjectId,
        ref: 'UserPin',
    }],
    savedPin:[{
        type:Schema.Types.ObjectId,
        ref: 'UserSavedPin',
    }],
    dp:{
        type:String,
    },
}, {timestamps:true});

usersSchema.plugin(plm);

export const User = mongoose.model("User", usersSchema);