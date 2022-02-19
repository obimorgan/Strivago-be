import express, {Request, Response, NextFunction} from "express";
import { JWTAuthentication } from "../middlewares/JWTauthentication"
import usersSchema from "./userModel";
import bcrypt from "bcrypt"

const userRouter = express.Router()

userRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await new usersSchema(req.body)
    newUser.password = await bcrypt.hash(req.body.password, 12)
    await newUser.save()
    res.status(200).send(newUser);
  } catch (error) {
    // console.log(error);
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


