import express, {Request, Response, NextFunction} from "express";
import { JWTAuthorization } from "src/middlewares/JWTauthorization";
import usersSchema from "./userModel";
import bcrypt from "bcrypt"


const userRouter = express.Router()

userRouter.route("/register").post(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await new usersSchema(req.body)
    user.password = await bcrypt.hash(req.body.password, 12)
    await user.save()
    
    res.status(200).send(user);
    console.log("registered");
  } catch (error) {
    console.log(error);
    res.sendStatus(400)
    next(error);
  }
});

// userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.checkCredentials(email, password);
//     if (user) {
//       const { accessToken, refreshToken } = await JWTAuthorization(user);
//       res.send({ accessToken, refreshToken });
//     } else {
//       res.sendStatus(404)
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

export default userRouter


