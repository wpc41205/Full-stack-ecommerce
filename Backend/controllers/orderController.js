import orderModel from '../models/orderModel.js';
import userModel from '../models/usersModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

//global variables
const currency = 'INR';
const delivery_charge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
 try {
    const { items, amount, address} = req.body;
    const userId = req.body.userId; // Get userId from auth middleware
    const origin = req.headers.origin || 'http://localhost:3000'; // Default origin

    const orderData = {
        userId,
        items,
        amount,
        address,
        paymentMethod: 'Stripe',
        payment: false,
        date: Date.now(),
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_item = items.map((item) => ({
        price_data: {
            currency: currency,
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100
        },
        quantity: item.quantity,
    }));

    line_item.push({
        price_data: {
            currency: currency,
            product_data: {
                name: 'Delivery Charges',
            },
            unit_amount: delivery_charge * 100
        },
        quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_item,
        mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });

 } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
 }
}

// Plact orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        // รับข้อมูลจาก User
        const { userId, items, amount, address } = req.body;

        // สร้าง order ใน database
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // สร้าง order สำหรับ Razorpay (อันนี้ยังใช้ key แบบ mock ไว้ก่อน)
        // ในอนาคตไป import razorpay แล้วอาจจะใส่ secret key ใหม่ตรงนี้
        // ตัวอย่างสมมุติ (ไม่มีการสร้าง signature จริง เพราะยังไม่มี secret key)

        // สร้าง structure response แบบ mock ให้ frontend ไปดำเนินการจ่าย
        const razorpayOrder = {
            id: `mock_order_${newOrder._id}`,
            amount: amount * 100, // Razorpay รับในหน่วย paise
            currency: 'INR',
            receipt: `${newOrder._id}`,
            status: 'created'
        };

        res.json({ 
            success: true,
            razorpayOrder,
            orderId: newOrder._id,
            message: 'Razorpay order created (mock)'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
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
    try {
        const { orderId, status } = req.body;
        
        await orderModel.findByIdAndUpdate(orderId, { status: status });
        
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrderStatus };