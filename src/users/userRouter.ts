import express, {Request, Response, NextFunction} from "express";
import { JWTAuthentication } from "../middlewares/JWTauthentication"
import usersSchema from "./userModel";
import bcrypt from "bcrypt"
import { userDocument } from "./types";
import jwt from "jsonwebtoken";

const userRouter = express.Router()

userRouter.route("/register").post(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await new usersSchema(req.body)
    console.log(user)
    user.password = await bcrypt.hash(req.body.password, 12)
    await user.save()
    console.log(user)
    
    res.status(200).send(user);
    console.log("registered");
  } catch (error) {
    console.log(error);
    res.sendStatus(400)
    next(error);
  }
});

userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { email, password } = req.body;
    const user = await usersSchema.findOne({email, password});
    if (user) {
      const { accessToken, refreshToken } = await JWTAuthentication(user);
      res.send({ accessToken, refreshToken });
    } else {
      res.status(404).send("Email and password are not valid")
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
});

export default userRouter


