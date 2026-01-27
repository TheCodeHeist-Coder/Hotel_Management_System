import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';

import authRoutes from "./src/routes/auth.route"
import hotelRoutes from "./src/routes/hotel.route"



const app = express();
app.use(express.json());

const port = process.env.PORT;


//! Routes
app.use("/api/auth", authRoutes)
app.use("/api", hotelRoutes)



app.listen(port , () => {
    console.info("Server is alive.....")
})