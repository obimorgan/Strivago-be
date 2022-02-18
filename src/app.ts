import cors from "cors"
import express from "express";
import userRouter from './users/userRouter'


const app = express()
app.use(express.json())
app.use(cors())

app.use("/user", userRouter)

export default app