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

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            connectTimeoutMS: 30000, // 30 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: true, // Enable mongoose buffering to handle connection timing
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    }
}

export default connectDB;