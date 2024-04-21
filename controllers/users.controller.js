// use is controller for jwt authentication

import { User } from "../models/users.model.js";
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'

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