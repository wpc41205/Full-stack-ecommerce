import orderModel from '../models/orderModel.js';
import userModel from '../models/usersModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Plact orders using COD Method
const placeOrder = async (req, res) => {

    try {
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'Order Placed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Plact orders using Stripe Method
const placeOrderStripe = async (req, res) => {

}

// Plact orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//user Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update order status from Admin Panel
const updateOrderStatus = async (req, res) => {

}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrderStatus };