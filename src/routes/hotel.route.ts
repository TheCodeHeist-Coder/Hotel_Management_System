import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();


// Create a new Hotel(owner only)
 router.post("/hotels", async(req, res) => {

    const {name, description, city, country, amenities} = req.body as {
        name: string,
        description: string,
        city: string,
        country: string,
        amenities: string[]
    }


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
    const hotel = await prisma.hotel.create({
        data:{
         name: name,
         ownerId: userId as string,
         description: description,
         city: city,
         country: country,
         amenities: amenities
        }
    })

    return res.status(201).json({
        "success": true,
        "data":{
            "id": hotel.id,
            "ownerId": hotel.ownerId,
            "name": hotel.name,
            "description": hotel.description,
            "city": hotel.city,
            "country": hotel.country,
            "amenities": hotel.amenities,
            "rating": hotel.ratings,
            "totalReviewa": hotel.totalReviews
        },
        "error": null
    })
        
    } catch (error) {
      console.log(error)
      res.status(500).json({
        "success": false,
        "error": "Internal server error...."
      })  
    }

 })



export default router;