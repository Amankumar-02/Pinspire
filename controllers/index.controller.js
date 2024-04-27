import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/users.model.js';
import {Post} from '../models/posts.model.js';

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
        username: req.session.passport.user
    }).populate("posts");
    res.render("profile", { title: 'Pinterest Profile', userDets: userDets || ""})
});

// profile dashboard
export const indexSavedPins = AsyncHandler( async(req, res)=>{
    // the below is syntax to get authenticated username from session.
    // console.log(req.session.passport.user)
    const userDets = await User.findOne({
        username: req.session.passport.user
    }).populate("posts");
    res.render("savePins", { title: 'Pinterest Profile', userDets: userDets || ""})
});

// feed dashboard
export const indexFeed = AsyncHandler( async(req, res)=>{
    const allPosts = await Post.find().populate("user");
    res.render("feed", {allPosts: allPosts});
});

// addPost dashboard
export const indexAddPost = AsyncHandler( (req, res)=>{
    const [postUploadError] = req.flash("postUploadError")
    res.render("addPost", {title: 'Pinterest AddPost', postUploadError: postUploadError || "" })
})

// show saved pins dashboard
export const indexShowSavedPin = AsyncHandler(async(req, res)=>{
    const userDets = await User.findOne({
        username: req.session.passport.user
    }).populate("posts");
    res.render("showSavedPin", { title: 'Show Pins', userDets: userDets || ""})
});