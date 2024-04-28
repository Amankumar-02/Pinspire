import { Post } from '../models/posts.model.js';
import { User } from '../models/users.model.js';
import { UserPin } from '../models/userPin.model.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import fs from 'fs';

// upload post
export const uploadPost = AsyncHandler(async(req, res)=>{
    const uploadFile = req.file; 
    if(!uploadFile) return res.status(404).json(new ApiError(404, "No file were upload"));
    const user = await User.findOne({
        username: req.session.passport.user
    });
    const exist = await Post.findOne({postText: req.body.postText});
    // if(exist) return res.status(404).json(new ApiError(404, "Post caption is already taken"));
    if(exist){
        fs.unlink(`./public/images/uploads/${req.file.filename}`, (err)=>{
            if(err) console.error(err);
            console.log("Failed post image removed")
        });
        req.flash("postUploadError", "Post caption is already taken");
        return res.redirect('/addpost');
    }
    const newPost = await Post.create({ 
        postText: req.body.postText,
        description: req.body.description,
        image: req.file.filename,
        user:user._id,
    });
    
    const pinExist = await UserPin.findOne({
        $and:[{userPinTitle: req.body.pinTitle}, {userPin: user._id}]
    });
    let newPin;
    if(pinExist){
        newPin = await UserPin.findOneAndUpdate({
            $and: [{userPin: user._id}, {userPinTitle: req.body.pinTitle}]
        }, 
        {
            $addToSet:{
                userPostPin: newPost._id
                }
        }, {
            new: true,
        });
        // return res.redirect("/profile");
    }else{
        newPin = await UserPin.create({
            userPinTitle: req.body.pinTitle,
            pinCover: newPost.image,
            userPin: user._id,
            userPostPin: [newPost._id],
        })
    }
    
    //Method 1 to update and save
    await User.findByIdAndUpdate(newPost.user, {
        $addToSet: {posts: newPost._id, pins:newPin._id}
        },{
        new: true,
        },
    );
    await Post.findByIdAndUpdate(newPost._id, {
        $set:{
            pin: newPin._id
        }
    }, {new:true})
    return res.redirect("/profile");

    //Method 2 to update and save
    // const userFetch = await User.findById(newPost.user);
    // userFetch.posts.push(newPost._id);
    // await userFetch.save({validateBeforeSave:false});

    // return res.status(200).json(new ApiResponse(200, newPost, "Post is uploaded successfully"))
});