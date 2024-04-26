import { Router } from 'express';
import { localRegisterUser, localLoginUser, localLogoutUser } from '../controllers/passportLocalUser.controller.js';
import { indexLogin, indexRegister, indexProfile, indexFeed } from '../controllers/index.controller.js';
import {uploadPost} from '../controllers/posts.controller.js';
import { isLoggedIn, isLoggedOut } from '../passportConfig.js';
import {upload} from '../middlewares/multer.middlerware.js';
// import {createUser, allUserPost} from '../controllers/users.controller.js';
// import {createPost} from '../controllers/posts.controller.js';

export const indexRouter = Router();

// login dashboard
indexRouter.get('/', isLoggedOut, indexLogin);
// register dashboard
indexRouter.get('/register', isLoggedOut, indexRegister);
// profile dashboard
indexRouter.get("/profile", isLoggedIn, indexProfile)
indexRouter.get("/feed", isLoggedIn, indexFeed);
indexRouter.post("/upload", isLoggedIn, upload.single('file'), uploadPost);



// local register route
indexRouter.post("/usersRegister", localRegisterUser);
// local login route
indexRouter.post("/usersLogin", localLoginUser);
// local logout route
indexRouter.get("/userlogout", localLogoutUser);



// indexRouter.get('/createuser',createUser);
// indexRouter.get('/createpost',createPost);
// indexRouter.get('/createpost',createPost);
// indexRouter.get('/alluserpost',allUserPost);