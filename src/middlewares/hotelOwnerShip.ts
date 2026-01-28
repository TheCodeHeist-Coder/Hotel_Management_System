import { NextFunction , Request, Response} from "express";
import { prisma } from "../../lib/prisma";



export const hotelOwnerShip = async(req: Request, res: Response, next: NextFunction) => {

    const hotelId = req.params.hotelId;
    const userId = req.user?.userId;


    const hotel = await prisma.hotel.findUnique({
        where: {id: hotelId as string},
        select: {ownerId: true}
    })

    if(!hotel || hotel.ownerId !== userId){
        return res.status(403).json({
            "success": false,
            "error": "NOT_HOTEL_OWNER"
        })
    }

    next();

}