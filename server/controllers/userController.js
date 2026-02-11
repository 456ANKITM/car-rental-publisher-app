import User from "../models/User.js";
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
import Car from "../models/Car.js";

// Generate JWT Token
const generateToken = (userID) => {
  const payload = userID;
  return jwt.sign(payload, process.env.JWT_SECRET)

}


export const registerUser = async (req, res) => {

    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password || password.length < 8 ){
            return res.json({success:false, message:"Fill all the fields"})
        }
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.json({success:false, message:"user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password:hashedPassword})

        const token = generateToken(user._id.toString())

        res.json({
            success:true,
            token,
        })
    } catch(error){
        console.log(error.message);
        return res.json({success:false, message:error.message})

    }
}

export const loginUser = async (req, res) => {
    try{
     const {email, password} = req.body;
     const user = await User.findOne({email})
     if(!user) return res.json({success:false, message:"User does not exist"})
    const isMatch = await bcrypt.compare (password, user.password)
    if(!isMatch) return res.json({success:false, message:"Invalid Password"})
    const token = generateToken(user._id.toString())

        res.json({
            success:true,
            token,
        })
    } catch (error) {
          console.log(error.message);
        return res.json({success:false, message:error.message})
    }
}

// Get use data using token 
export const getUserData = async(req,res) => {
   try{
           const {user} = req;
           res.json({success:true, user})
   } catch (error){
      console.log(error.message);
        return res.json({success:false, message:error.message})
   }
}

export const getCars = async (req, res) => {
    try {
        const cars = await Car.find()
        res.json({success:true, cars})
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message})
    }
        
    }
    
