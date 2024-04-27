import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/users.model.js';

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
    const [postUploadError] = req.flash("postUploadError")
    res.render("profile", { title: 'Pinterest Profile', userDets: userDets || "", postUploadError: postUploadError || "" })
});

// profile dashboard
export const indexSavedPins = AsyncHandler( async(req, res)=>{
    // the below is syntax to get authenticated username from session.
    // console.log(req.session.passport.user)
    const userDets = await User.findOne({
        username: req.session.passport.user
    }).populate("posts");
    res.render("savePins", { title: 'Pinterest Profile', userDets: userDets || "", postUploadError: "" })
});

// feed dashboard
export const indexFeed = AsyncHandler((req, res)=>{
    res.render("feed")
});