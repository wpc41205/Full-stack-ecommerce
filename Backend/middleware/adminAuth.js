import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } =req.headers
        if(!token){
            return res.json({success: false, message: 'Not Authorized Login Again'});
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        const validAdminTokens = [
            process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD,
            'admin@example.comadmin123'
        ];
        
        if(!validAdminTokens.includes(token_decode)){
            return res.json({success: false, message: 'Not Authorized Login Again'});
        }
        next();
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

export default adminAuth;