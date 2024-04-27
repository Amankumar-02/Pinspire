// use is controller for jwt authentication

import { User } from "../models/users.model.js";
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'
import fs from 'fs';

export const createUser = AsyncHandler(async(req, res)=>{
    // const {username, email, fullname, password, dp} = req.body;
    const exist = await User.findOne({username:"Aman"});
    if(!exist){
        const newUser = await User.create({
            username:"Aman",
            email:"a@",
            fullname:"Aman Kumar",
            password:"1234",
            posts:[],
        });
        return res.status(200).json(new ApiResponse(200, newUser, "New User Created"));
    }else{
        return res.status(200).json(new ApiResponse(200, exist, "New User Created"));
    }
});

export const allUserPost = AsyncHandler(async(req, res)=>{
    // populate 
    const allPost = await User.findById("6624f214d25ba599b7efdb33").populate("posts");
    return res.status(200).json(new ApiResponse(200, allPost.posts, "All posts created by the user"))
});

export const updateProfileImage = AsyncHandler(async(req, res)=>{
    const profileImg = req.file;
    if(!profileImg) return res.status(404).json(new ApiError(404, "No file were upload"));
    const user = await User.findOne({ username: req.session.passport.user });
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    const oldProfileImg = user.dp;

    await User.findOneAndUpdate({username: req.session.passport.user}, {
        $set:{
            dp: profileImg.filename
        },
    },{
        new: true,
    });
    
    // Remove the old profile image file
    if (oldProfileImg !== "defaultImg.png") {
        fs.unlink(`./public/images/dp/${oldProfileImg}`, (err) => {
            if (err) console.error(err);
            console.log('Old profile image removed');
        });
    }
    res.redirect("/profile");
});