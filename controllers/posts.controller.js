import { Post } from '../models/posts.model.js';
import { User } from '../models/users.model.js';
import { UserPin } from '../models/userPin.model.js';
import { UserSavedPin } from '../models/userSavedpin.model.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import fs from 'fs';

// upload post
export const uploadPost = AsyncHandler(async(req, res)=>{
    const uploadFile = req.file; 
    if(!uploadFile) return res.status(404).json(new ApiError(404, "No file were upload"));
    const user = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
        
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

// savedPostPin
export const savedPostPin = AsyncHandler(async(req, res)=>{
    const savePostId = req.params.savePostId;
    const post = await Post.findById(savePostId);
    const user = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    });
    const savedPinExist = await UserSavedPin.findOne({
        $and:[{userSavedPinTitle: req.body.savedPinTitle}, {userSavedPin: user._id}]
    });
    let newPin;
    if(savedPinExist){
        newPin = await UserSavedPin.findOneAndUpdate({
            $and: [{userSavedPin: user._id}, {userSavedPinTitle: req.body.savedPinTitle}]
        }, 
        {
            $addToSet:{
                userSavedPostPin: post._id
                }
        }, {
            new: true,
        });
    }else{
        newPin = await UserSavedPin.create({
            userSavedPinTitle: req.body.savedPinTitle,
            savedPinCover: post.image,
            userSavedPin: user._id,
            userSavedPostPin: [post._id],
        })
    }
    
    //Method 1 to update and save
    await User.findByIdAndUpdate(newPin.userSavedPin, {
        $addToSet: {savedPin:newPin._id}
        },{
        new: true,
        },
    );
    // await Post.findByIdAndUpdate(newPost._id, {
    //     $set:{
    //         pin: newPin._id
    //     }
    // }, {new:true})
    req.flash("savePostAlert", "Post is saved successfully");
    return res.redirect(`/show/postinfo/${post._id}`);
});

// delete post
export const deletePost = AsyncHandler(async (req, res) => {
    const postId = req.params.postId;
    // delete post from post model
    const deletedPost = await Post.findByIdAndDelete(postId);
    fs.unlink(`./public/images/uploads/${deletedPost.image}`, (err)=>{
        if(err) console.error(err);
        console.log("Failed post image removed")
    });
    // delete post from user model
    await User.findOneAndUpdate(
        {
            username: req.user.username || req.user.displayName.replaceAll(" ", "")
        },
        { $pull: { posts: postId } },
        { new: true }
    );
    // delete post from user pin model
    const userPin = await UserPin.findOneAndUpdate(
        {
            userPostPin: postId
        }, 
        { $pull: { userPostPin: postId }},
        { new: true }
    ).populate("userPostPin");
    if(deletedPost.image === userPin.pinCover){
        await UserPin.findByIdAndUpdate( userPin._id,
            { $set: { pinCover: userPin?.userPostPin[0]?.image }},
            { new: true }
        );
    }
    if(userPin.userPostPin.length <= 0){
        const userData = await UserPin.findByIdAndDelete(userPin._id);
        await User.findByIdAndUpdate(userData.userPin, 
            { $pull: {pins: userData._id} },
            { new:true }
        );
    }
    // delete post from otheruser pin model
    const userSavedPins = await UserSavedPin.find({ userSavedPostPin: postId });
    if(userSavedPins){
        for (const userSavedPin of userSavedPins) {
            const savedPin = await UserSavedPin.findByIdAndUpdate(
                userSavedPin._id,
                { $pull: { userSavedPostPin: postId } },
                { new: true }
            ).populate("userSavedPostPin");
            if(deletedPost.image === savedPin.savedPinCover){
                await UserSavedPin.findByIdAndUpdate(
                    savedPin._id,
                    { $set: { savedPinCover:savedPin?.userSavedPostPin[0]?.image } },
                    { new: true }
                );
            }
            if(savedPin.userSavedPostPin.length <= 0){
                const userData = await UserSavedPin.findByIdAndDelete(userSavedPin._id);
                await User.findByIdAndUpdate(userData.userSavedPin, 
                    { $pull: {savedPin: userData._id} },
                    { new:true }
                );
            }
        }
    }
    res.redirect("/profile");
});


// unsave post 
export const unsavePost = AsyncHandler(async(req, res)=>{
    const postId = req.params.postId;
    const postData = await Post.findById(postId);
    const user = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    });
    // unsave saved post
    const savedPosts = await UserSavedPin.findOneAndUpdate({ 
        $and: [{userSavedPin: user._id}, {userSavedPostPin: postId}]
     }, {
        $pull: {userSavedPostPin: postId}
     },{
        new:true
     }).populate("userSavedPostPin");
     if(postData.image === savedPosts.savedPinCover){
        await UserSavedPin.findByIdAndUpdate(
            savedPosts._id,
            { $set: { savedPinCover:savedPosts?.userSavedPostPin[0]?.image } },
            { new: true }
        );
    };
    if (savedPosts.userSavedPostPin.length <= 0) {
        const userData = await UserSavedPin.findByIdAndDelete(savedPosts._id);
        await User.findByIdAndUpdate(savedPosts.userSavedPin,
            { $pull: { savedPin: userData._id } },
            { new: true }
        );
    }
    res.redirect("/savePins")
});