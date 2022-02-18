import userModel from 'src/users/userModel';
import { RequestHandler } from 'express';
import jwt from "jsonwebtoken"

process.env.TS_NODE_DEV && require("dotenv").config()
const {JWT_SECRET} = process.env


// export const verifyJWT = (token: string) =>
//   new Promise((resolve, reject) =>
//     jwt.verify(token, JWT_SECRET, (err: any, payload: unknown ) => {
//       if (err) reject(err);
//       else resolve(payload);
//     })
//   );

export const JWTAuthorization: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).send({ error: "No token provided" })

    const { _id } = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string }

    const user = await userModel.findById(_id)

    if (!user) return res.status(401).send({ error: "Invalid token" })

    req.user = user

    next()

};


