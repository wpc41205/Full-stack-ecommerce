import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import userRouter from '../routes/userRoute.js';
import productRouter from '../routes/productRouts.js';
import cartRouter from '../routes/cartRoute.js';
import orderRouter from '../routes/orderRoute.js';

// Load environment variables
// In Vercel, environment variables are automatically loaded
// No need to manually load .env file

// Debug: Log loaded environment variables
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Missing');

// App Config
const app = express();

// Connect to databases
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "https://full-stack-ecommerce-frontend-tau.vercel.app",
        process.env.ADMIN_URL || "https://full-stack-ecommerce-admin-seven.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://*.vercel.app",
        "https://*.netlify.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// api endpoint
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send("API Working");
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler - removed to fix routing error

// Export the app as a Vercel serverless function
export default app;
