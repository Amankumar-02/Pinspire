import { Post } from '../models/posts.model.js';
import { User } from '../models/users.model.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'

export const createPost = AsyncHandler(async(req, res)=>{
    const exist = await Post.findOne({postText:"first post - Hello world4"})
    if(!exist){
        const newPost = await Post.create({
            postText:"first post - Hello world4",
            user:"6624f214d25ba599b7efdb33"
        });

        //Method 1 to update and save
        await User.findByIdAndUpdate(newPost.user, {
            $addToSet: {posts: newPost._id}
            },{
            new: true,
            },
        );

        //Method 2 to update and save
        // const userFetch = await User.findById(newPost.user);
        // userFetch.posts.push(newPost._id);
        // await userFetch.save({validateBeforeSave:false});
        
        return res.status(200).json(new ApiResponse(200, newPost, "New Post Created"));
    }else{
        return res.status(200).json(new ApiResponse(200, exist, "New Post Created"));
    }
});
