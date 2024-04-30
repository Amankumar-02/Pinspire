import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/users.model.js';
import {Post} from '../models/posts.model.js';
import { UserPin } from '../models/userPin.model.js';
import { UserSavedPin } from '../models/userSavedpin.model.js';

// login dashboard
export const indexLogin = AsyncHandler((req, res)=>{
    const [loginErrorFlash] = req.flash("error")
    res.render('index', { title: 'Pinterest Login', loginErrorFlash: loginErrorFlash || "" });
});

// register dashboard
export const indexRegister = AsyncHandler((req, res)=>{
    const [registerErrorFlash] = req.flash("registerError");
    res.render('register', { title: 'Pinterest Signup', registerErrorFlash: registerErrorFlash || "" });
});

// profile dashboard
export const indexProfile = AsyncHandler( async(req, res)=>{
    // the below is syntax to get authenticated username from session.
    // console.log(req.session.passport.user)
    const userDets = await User.findOne({
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    }).populate("pins");
    if(userDets.dp.includes("http")){
        res.render("profile", { title: 'Pinterest Profile', userDets: userDets || "", imgFormat: false})
    }
    res.render("profile", { title: 'Pinterest Profile', userDets: userDets || "", imgFormat: true})
});

// profile dashboard
export const indexSavedPins = AsyncHandler( async(req, res)=>{
    const userSavedDets = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    }).populate("savedPin");
    if(userSavedDets.dp.includes("http")){
        res.render("profileSavePins", { title: 'Pinterest Profile', userDets: userSavedDets || "", imgFormat: false})
    }
    res.render("profileSavePins", { title: 'Pinterest Profile', userDets: userSavedDets || "", imgFormat: true})
});

// feed dashboard
export const indexFeed = AsyncHandler( async(req, res)=>{
    const allPosts = await Post.find().populate("user");
    // Fisher-Yates shuffle algorithm
    for (let i = allPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
    }
    res.render("feed", {allPosts: allPosts});
});

// addPost dashboard
export const indexAddPost = AsyncHandler( async(req, res)=>{
    const [postUploadError] = req.flash("postUploadError");
    const existingPins = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    }).populate("pins");
    res.render("addPost", {title: 'Pinterest AddPost', postUploadError: postUploadError || "", pinDets: existingPins.pins || "" })
})

// show pins dashboard
export const indexShowPin = AsyncHandler(async(req, res)=>{
    const urlPinTitle = req.params.pinTitle;
    const user = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    })
    const userPostsFromPin = await UserPin.findOne({
        $and:[{userPinTitle: urlPinTitle}, {userPin: user._id}]
    }).populate("userPostPin");
    res.render("showPin", { title: 'Show Pins', userPostsFromPin: userPostsFromPin || ""})
});
// show saved pins dashboard
export const indexShowSavedPin = AsyncHandler(async(req, res)=>{
    const urlSavedPinTitle = req.params.pinTitle;
    const user = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    })
    const userPostsFromSavedPin = await UserSavedPin.findOne({
        $and:[{userSavedPinTitle: urlSavedPinTitle}, {userSavedPin: user._id}]
    }).populate("userSavedPostPin");
    res.render("showSavedPin", { title: 'Show Pins', userPostsFromPin: userPostsFromSavedPin || ""})
});


// show post info dashboard
export const indexShowPostInfo = AsyncHandler( async(req, res)=>{
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("user");
    const savedPinList = await User.findOne({
        // username: req.session.passport.user
        username: req.user.username || req.user.displayName.replaceAll(" ","")
    }).populate("savedPin");
    const savePostAlert = req.flash("savePostAlert");
    if(savedPinList._id.toString() === post.user._id.toString()){
        res.render("postInfo", {title: 'Show Pins', postInfo: post,  savedPinList: savedPinList || "" ,savePostAlert:savePostAlert || "", showSaveIcon: false, btnName: "Save"  } );
    }else{
        const exist = await UserSavedPin.findOne({
            $and:[{userSavedPostPin: post._id}, {userSavedPin: savedPinList._id}]
        });
        if(exist){
            res.render("postInfo", {title: 'Show Pins', postInfo: post,  savedPinList: savedPinList || "" ,savePostAlert:savePostAlert || "", showSaveIcon: true, btnName: "Saved" } );
        }else{
            res.render("postInfo", {title: 'Show Pins', postInfo: post,  savedPinList: savedPinList || "" ,savePostAlert:savePostAlert || "", showSaveIcon: true, btnName: "Save" } );
        }
    }
});