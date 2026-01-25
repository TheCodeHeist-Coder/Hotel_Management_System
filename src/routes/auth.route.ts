import { Router } from "express";
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userSchema } from "../schemas/user.schema";


const router = Router();


router.post("/signup", async (req, res) => {

    const parsedResult = userSchema.safeParse(req.body);

    if (!parsedResult.success) {
        return res.status(400).json({
            "success": false,
            "data": null,
            "error": "INVALID_REQUEST"
        })
    }

    const { name, email, password, role, phone } = parsedResult.data;



    try {
        //! Check existed User
        const existesUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existesUser) {
            return res.status(400).json({
                "success": false,
                "data": null,
                "error": "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                phone
            }
        })

        return res.status(201).json({
            "success": true,
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "phone": user.phone
            },
            "error": null
        })
    } catch (error) {

        console.log(error)

        return res.status(500).json({
            "success": false,
            "error": "Internal server error"
        })

    }






})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(401).json({
                "success": false,
                "data": null,
                "error": "INVALID_CREDENTIALS"
            })
        }

        const isPasswordMatched = bcrypt.compare(password, user.password);


        if (!isPasswordMatched) {
            return res.status(401).json({
                "success": false,
                "data": null,
                "error": "INVALID_CREDENTIALS"
            })
        }

        const token = jwt.sign({
            userId: user.id
        }, process.env.JWT_SECRET ?? " ")


        return res.status(200).json({
            "success": true,
            "data": {
                "token": token,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role
                }
            },
            "error": null
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "error": "Internal Server Error..."
        })
    }


})


export default router