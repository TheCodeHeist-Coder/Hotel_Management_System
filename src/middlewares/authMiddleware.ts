import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload  } from 'jsonwebtoken'

interface jwtUserPayload extends JwtPayload{
    userId: string,
    userRole: string
}



export const authMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    
    // Receiving authHeader from authorization header
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(404).json({
            "success": false,
            "error": "Not Authorized"
        })
    }
     
    // check authHeader is in correct format
    const parts = authHeader.split(" ");

    if(parts.length != 2 || parts[0] != "Bearer"){
          return res.status(401).json({
            "success": false,
            "error": "Not Authorized"
        })
    }
    

    // Extracting token
    const token = parts[1] as string;

    try {
      if(!process.env.JWT_SECRET){
        throw new Error("Something bad in authorization")
      }
        // verifying
        const decoded =  jwt.verify(token, process.env.JWT_SECRET) as jwtUserPayload;
        req.user = decoded;
        next();
    } catch (error) {

          console.log(error)

           return res.status(500).json({
            "success": false,
            "error": "Internal server error"
        })
    }


}