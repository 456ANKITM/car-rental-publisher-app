import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js"
import ownerRoutes from "./routes/ownerRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

// Initialize express app
const app = express();

const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors())
app.use(express.json())



app.get("/", (req, res)=>{
  res.send("Server is running")
})
app.use("/api/user", userRoutes)
app.use("/api/owner", ownerRoutes)
app.use("/api/bookings", bookingRoutes)

const startServer = async () => {
    await connectDB()
    app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`)
})

}

startServer()



