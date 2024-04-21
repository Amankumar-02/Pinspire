import mongoose from "mongoose";

const mongodbConnect = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/pinterestClone`);
        console.log(`MongoDb is connected successfully on host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to MongoDB");
        process.exit(1);
    };
};

export default mongodbConnect;