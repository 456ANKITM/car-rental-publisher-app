import imagekit from "../configs/imagekit.js";
import User from "../models/User.js";
import fs from "fs";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list car" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// List Car

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({ 
      file: fileBuffer,
       fileName: imageFile.originalname, 
       folder: '/cars' 
      })

  
    const image = response.url;
    await Car.create({ ...car, owner: _id, image });

    res.json({ success: true, message: "car added" });
  } catch (error) {
   

    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async(req, res) => {
  try{
     const {_id} = req.user;
     const cars = await Car.find({owner:_id, isDeleted: false })
     res.json({success:true, cars})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const toggleCarAvailability = async (req, res) => {
  try{
     const {_id} = req.user;
     const {carID} = req.body;
     const car = await Car.findById(carID)

     // checking if car belongs to the user or not
     if(car.owner.toString() !== _id.toString()) {
      return res.json({success:false, message:"unauthorized"})
     }

     car.isAvailable = !car.isAvailable
     await car.save()

     res.json({success:true, message:"Availability toggeled"})

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


export const deleteCar = async (req, res) => {
  try{
     const {_id} = req.user;
     const {carID} = req.body;
     const car = await Car.findById(carID)

      if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

     if(car.owner.toString() !== _id.toString()) {
      return res.json({success:false, message:"unauthrorized"})
     }

     car.isDeleted = true;
    car.isAvailable = false;
    

    await car.save();

    return res.json({success:true, message:"Car Deleted"})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


export const getDashboardData = async (req, res) => {
  try{
     const {_id, role} = req.user;

     if(role !== "owner") {
      return res.json({success:false, message:"unauthorized"})
     }

     const cars = await Car.find({owner:_id})
     const bookings = await Booking.find({owner:_id}).populate('car').sort({createdAt:-1})
     const pendingBookings = await Booking.find({owner:_id, status:"pending"})
     const completedBookings = await Booking.find({owner:_id, status:"confirmed"})

     // calculate monthly revenue from bookings where status is confirmed 

     const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

     const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0,3),
      monthlyRevenue
     }

     res.json({success:true, dashboardData})

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const updateUserImage = async (req, res) => {
  try{
   const {_id} = req.user;
   const imageFile = req.file;

    // upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({ 
      file: fileBuffer,
       fileName: imageFile.originalname, 
       folder: '/users' 
      })

  
    const image = response.url;
    await User.findByIdAndUpdate(_id, {image});
    res.json({success:true, message:"image updated"}); 
  } catch (error) {
     console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}
