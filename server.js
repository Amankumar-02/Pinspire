import dotenv from 'dotenv';
dotenv.config({path:"./env"});
import mongodbConnect from './db/index.js';
import {app, port} from './app.js';

mongodbConnect()
.then(()=>{
    app.listen(port, ()=>{
        console.log("Server is running in port: ", port)
    });
})
.catch((err)=>{
    console.log(err);
});