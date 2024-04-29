import mongoose, { Schema } from 'mongoose';

const oAuthSchema = new Schema({
    _id: String,
    username: String,
    dp: String,
    provider: String,
}, {timestamps:true});

export const OAuth = mongoose.model("oAuth", oAuthSchema);