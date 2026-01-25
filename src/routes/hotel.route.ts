import { Router } from "express";

const router = Router();


// Create a new Hotel(owner only)
 router.post("/hotels", (req, res) => {

   
    const {name, description, city, country, amenities} = req.body;


    const userId = req.user?.userId;
    const userRole = req.user?.userRole;

    if(userRole !== "owner"){
        return res.status(400).json({
             "success": false,
             "data": null,
             "error": "UNAUTHORIZED"
        })
    }


    





    try {
        
    } catch (error) {
        
    }

 })



export default router;