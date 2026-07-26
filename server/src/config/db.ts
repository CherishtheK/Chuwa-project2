import mongoose from 'mongoose';

const connectDB = async(): Promise<void> => {
    const mongouri = process.env.MONGO_URI;

    if(! mongouri){
        throw new Error('MONGO_URI is not defined in environment variables');
    }
    try{
        await mongoose.connect(mongouri);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.error('MongoDB connection failed:', (err as Error).message);
        process.exit(1);
    }
}

export default connectDB;