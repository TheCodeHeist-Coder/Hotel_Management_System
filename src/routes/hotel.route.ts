import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Decimal } from "@prisma/client/runtime/client";
import { string } from "zod";
import { hotelOwnerShip } from "../middlewares/hotelOwnerShip";

const router = Router();


// Create a new Hotel(owner only)
router.post("/hotels", authMiddleware, async (req, res) => {

    const { name, description, city, country, amenities } = req.body as {
        name: string,
        description: string,
        city: string,
        country: string,
        amenities: string[]
    }


    const userId = req.user?.userId;
    const userRole = req.user?.userRole;
    console.log(userRole)

    if (userRole != "owner") {
        return res.status(400).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
    }

    try {
        const hotel = await prisma.hotel.create({
            data: {
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
            "data": {
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



// Create a room inside a hotel(Owner only...)

router.post("/hotels/:hotelId/rooms", authMiddleware, hotelOwnerShip, async (req, res) => {
    const { roomNumber, roomType, pricePerNight, maxOccupancy } = req.body as {
        roomNumber: string,
        roomType: string,
        pricePerNight: Decimal,
        maxOccupancy: number
    }

    const hotelId = req.params.hotelId;



    if (!hotelId) {
        return res.status(400).json({
            "success": false,
            "data": null,
            "error": "HOTEL_NOT_FOUND"
        })
    }
    const userRole = req.user?.userRole;

    if (userRole != 'owner') {
        return res.status(401).json({
            "success": false,
            "data": null,
            "error": "Forbidden"
        })
    }



    const existedRoom = await prisma.room.findFirst({
        where: {
            hotelId: hotelId as string,
            roomNumber

        }
    })

    if (existedRoom) {
        return res.status(400).json({
            "success": false,
            "data": null,
            "error": "ROOM_ALREADY_EXISTS"
        })
    }


    const room = await prisma.room.create({
        data: {
            roomNumber,
            roomType,
            pricePerNight,
            maxOccupancy,
            //@ts-ignore
            hotelId
        }
    })


    return res.status(201).json({
        "success": true,
        "data": {
            "id": room.id,
            "hotelId": room.hotelId,
            "roomNumber": room.roomNumber,
            "roomType": room.roomType,
            "pricePerNight": room.pricePerNight,
            "maxOccupancy": room.maxOccupancy

        },
        "error": null
    })




})





router.get("/hotels", authMiddleware, async (req, res) => {

    const { city, country, minPrice, maxPrice, minRating } = req.query;

    const userId = req.user?.userId;
    console.log(userId)

    const hotels = await prisma.hotel.findMany();

    return res.json({
        "data": hotels
    })


})



export default router;