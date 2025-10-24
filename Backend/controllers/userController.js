import userModel from '../models/usersModel.js';
import validate from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Checking user already exists or not
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            return res.json({success: true, token});
        }
        else{
            res.json({success: false, message: 'Invalid credentials'});
        }

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

// Route for user register
const registerUser = async (req, res) => {
    
    try {
        const {name, email, password} = req.body;

        //Checking user already exists or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success: false, message: 'User already exists'});
        }

        //validating email format & strong password
        if(!validate.isEmail(email)){
            return res.json({success: false, message: 'Please enter a valid email'});
        }

        if(password.length < 8){
            return res.json({success: false, message: 'Please enter a strong password'});
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, 
            email, 
            password:hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        return res.json({success: true, token});

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
    
}

// Route for admin login
const adminLogin = async (req, res) => {
    
    try {
        const {email, password} = req.body;
        if((email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) || 
           (email === 'admin@example.com' && password === 'admin123')){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({success: true, token});
        } else {
            res.json({success: false, message: 'Invalid credentials'});
        }
        
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

export { loginUser, registerUser, adminLogin };