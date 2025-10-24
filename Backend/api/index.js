import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import userRouter from '../routes/userRoute.js';
import productRouter from '../routes/productRouts.js';
import cartRouter from '../routes/cartRoute.js';
import orderRouter from '../routes/orderRoute.js';

// Load .env using absolute paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env from Backend directory
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Debug: Log loaded environment variables
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');

// App Config
const app = express();

// Connect to databases
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
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

// Export the app as a Vercel serverless function
export default app;
