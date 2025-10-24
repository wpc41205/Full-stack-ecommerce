import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRouts.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Load environment variables
// In production (Vercel), environment variables are automatically loaded
// In development, load from .env file
if (process.env.NODE_ENV !== 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, '.env');
    dotenv.config({ path: envPath });
}

// Debug: Log loaded environment variables
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');

// App Config
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to databases
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "https://your-frontend-project.vercel.app",
        process.env.ADMIN_URL || "https://your-admin-project.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// api endpoint
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});