import jwt from "jsonwebtoken"
import User from "../models/User.js";

 export const protect = async(req, res, next)=> {
   const token = req.headers.authorization;
   if(!token){
    return res.json({success:false, message:"Not Authorized"})
   }
   try{
     const userID = jwt.decode(token, process.env.JWT_SECRET)
     if(!userID) {
         return res.json({success:false, message:"Not Authorized"})
     }
    req.user =  await User.findById(userID).select("-password")
    next()
   } catch (error) {
   return res.json({success:false, message:"Not Authorized"})
   }
}