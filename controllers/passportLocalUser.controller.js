import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/users.model.js';
import passport from "passport";

// local register route
export const localRegisterUser = AsyncHandler(async (req, res)=>{
    const {username, email, fullname, password} = req.body;
    if(!(username && email && fullname && password)){
      req.flash("registerError", "All fields are required");
      return res.redirect("/register");
    };
    const exist = await User.findOne({
      $or:[{username}, {email}]
    });
    if(exist){ 
      req.flash("registerError", "Username and Email already taken")
      return res.redirect("/register");
    };
    const userData = new User({
      username, email, fullname, dp:"defaultImg.png",
    });
    User.register(userData, req.body.password)
    .then(()=>{
      passport.authenticate("local")(req, res, ()=>{
        res.redirect("/profile");
      });
    });
  });

// local login route
export const localLoginUser = AsyncHandler(passport.authenticate("local", {
    successRedirect:"/profile",
    failureRedirect:"/",
    failureFlash:true,
  }), (req, res)=>{
});

// local logout route
export const localLogoutUser = AsyncHandler((req, res)=>{
    req.logout((err)=>{
      if(err) return next(err);
      return res.redirect('/');
    });
});