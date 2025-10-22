import express from 'express';
import { addToCart, updateCart, getUserData } from '../controllers/cardController.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/get', authUser, getUserData);
cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;