import { Router } from 'express';
import { localRegisterUser, localLoginUser, localLogoutUser } from '../controllers/passportLocalUser.controller.js';
import { indexLogin, indexRegister, indexProfile, indexSavedPins, indexFeed, indexAddPost, indexShowSavedPin } from '../controllers/index.controller.js';
import {updateProfileImage} from '../controllers/users.controller.js';
import {uploadPost} from '../controllers/posts.controller.js';
import { isLoggedIn, isLoggedOut } from '../passportConfig.js';
import {upload, upload2} from '../middlewares/multer.middlerware.js';

export const indexRouter = Router();

// login dashboard
indexRouter.get('/', isLoggedOut, indexLogin);
// register dashboard
indexRouter.get('/register', isLoggedOut, indexRegister);
// profile dashboard
indexRouter.get("/profile", isLoggedIn, indexProfile)
indexRouter.get("/savePins", isLoggedIn, indexSavedPins)
indexRouter.get("/feed", isLoggedIn, indexFeed);
indexRouter.get("/addpost", isLoggedIn, indexAddPost);
indexRouter.get("/show/savedpin/:pinTitle", isLoggedIn, indexShowSavedPin);



// local register route
indexRouter.post("/usersRegister", localRegisterUser);
// local login route
indexRouter.post("/usersLogin", localLoginUser);
// local logout route
indexRouter.get("/userlogout", localLogoutUser);



// user update profile image // user controller
indexRouter.post("/updateProfileImg", isLoggedIn, upload2.single('profileImg'), updateProfileImage);



// post controller
indexRouter.post("/upload", isLoggedIn, upload.single('file'), uploadPost);







// indexRouter.get('/createuser',createUser);
// indexRouter.get('/createpost',createPost);
// indexRouter.get('/createpost',createPost);
// indexRouter.get('/alluserpost',allUserPost);