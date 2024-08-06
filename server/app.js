import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(0);
});

// Import routes
import cabRoutes from "./routes/cabRoutes.js"
import tripRoutes from "./routes/tripRoutes.js"
import userRoutes from "./routes/userRoutes.js"

// Use routes
app.use('/api/cabs', cabRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/user', userRoutes);




export default app
