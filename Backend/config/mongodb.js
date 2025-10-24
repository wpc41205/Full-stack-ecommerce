import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully!');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    }
}

export default connectDB;