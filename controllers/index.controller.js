import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// login dashboard
export const indexLogin = AsyncHandler((req, res)=>{
    res.render('index', { title: 'Pinterest Login' });
});

// register dashboard
export const indexRegister = AsyncHandler((req, res)=>{
    res.render('register', { title: 'Pinterest Signup' });
});

// profile dashboard
export const indexProfile = AsyncHandler((req, res)=>{
    res.render("profile", { title: 'Pinterest Profile' })
});