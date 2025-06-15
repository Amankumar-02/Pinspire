import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "./models/users.model.js";
// import bcrypt from 'bcrypt';


export const initializingPassport = (passport)=>{
    // local strategy // with bcrypt
    // passport.use(new LocalStrategy(async function(username, password, done){
    //     try {
    //         const user = await User.findOne({username});
    //         // no error and no user
    //         if(!user) return done(null, false);
    //         // no error and password incorrect
    //         // if(user.password !== password) return done(null, false);
    //         const checkPassword = await bcrypt.compare(password, user.password);
    //         // no error and password incorrect
    //         if(!checkPassword){
    //             return done(null, false)
    //         };
    //         return done(null, user);
    //     } catch (error) {
    //         return done(error, false);
    //     }
    // }));


    // local strategy with passport-local-mongoose
    passport.use(new LocalStrategy(User.authenticate()));

    
    // google strategys
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // callbackURL: "http://localhost:3000/auth/google/callback"
        callbackURL: "https://pinterest-clone-backend-1.onrender.com/auth/google/callback"
    }, function (accessToken, refreshToken, profile, cb) {
        cb(null, profile)
    }));


    // github strategy
    // passport.use(new GitHubStrategy({
    //     clientID: process.env.GITHUB_CLIENT_ID,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //     callbackURL: "http://localhost:3000/auth/github/callback"
    //   },
    //   function(accessToken, refreshToken, profile, done) {
    //     done(null, profile)
    //   }
    // ));


    passport.serializeUser((user, done)=>{
        done(null, user);
    });
    passport.deserializeUser(async(user, done)=>{
        done(null, user);
    });


    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};

export const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated("local")) return next();
    return res.redirect("/");
};

export const isLoggedOut = (req, res, next)=>{
    if(req.isAuthenticated("local")) return res.redirect("/profile");
    return next();
};