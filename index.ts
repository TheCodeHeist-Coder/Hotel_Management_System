import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';

import authRoutes from "./src/routes/auth.route"



const app = express();
app.use(express.json());

const port = process.env.PORT;


//! Routes
app.use("/api/auth", authRoutes)



app.listen(port , () => {
    console.info("Server is alive.....")
})