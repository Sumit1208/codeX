const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async (req,res,next)=>{
    try{
        const token = req.cookies.token; 
        
        if(!token){
            throw new Error("Unauthorized: No token provided")
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {_id} = payload;

        if(!_id){
            throw new Error("Id is missing");
        }

        const user = await User.findById(_id).select("-password");
        if(!user){
            throw new Error("User doesn't exist");
        }
        // console.log(payload);
        if(user.role!='admin')
            throw new Error("Invalid Token");

        req.user = user;
        next();
        
    }
    catch(err){
        res.send("Error: "+ err.message);
    }
}

module.exports = adminMiddleware;

