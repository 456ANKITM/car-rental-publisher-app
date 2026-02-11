import express from "express"
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router()

router.post("/change-role", protect, changeRoleToOwner);
router.post("/add-car", upload.single("image"), protect, addCar);
router.get("/cars", protect, getOwnerCars);
router.post("/toggle-car", protect, toggleCarAvailability);
router.post("/delete-car", protect, deleteCar);
router.get("/dashboard", protect, getDashboardData);
router.post("/update-image", upload.single("image"), protect, updateUserImage );

export default router;