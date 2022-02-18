import supertest from "supertest"
import app from "../app"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const request = supertest(app)

describe("Testing Jest...", () => {
    it("should work", () => {
        expect(true).toBe(true)
    })
})

describe("Testing Endpoints", () => {

    beforeAll(done => {
        const { MONGO_CONNECTION_TEST } = process.env
        if (!MONGO_CONNECTION_TEST) throw new Error("Could not connect to mongoDB test ")
        mongoose.connect(MONGO_CONNECTION_TEST)
            .then(() => {
                console.log("Connected to mongoDB")
                done()
        })
    })
        afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => { done() })
        })
    const credentials = {
        email: "roby@morgan.com",
        password: "a;dlkgfhadfglkjafhg"
    }
    let userId: string

    it("should return new users details --> Post/Register", async () => {
        const response = await request.post("/user/register").send(credentials)

        expect(response.body._id).toBeDefined()
        userId = response.body._id
    })
    
    let token: string
    
    it("should return a valid access-token and refresher token when the user login", async () => {
        const response = await request.post("/users/login").send(credentials)
        console.log(response.body)
        expect(response.body.accessToken).toBeDefined()

        const { _id } = jwt.verify(response.body.accessToken.split(" ")[1], process.env.JWT_SECRET!) as { _id: string }
        expect(_id).toBe(userId)

        token = response.body.accessToken
    })

    it("should return a valid refresh token when the user login", async () => {
        const response = await request.post("/users/login").send(credentials)
        console.log(response.body)
        expect(response.body.refreshToken).toBeDefined()
        const { _id } = jwt.verify(response.body.refreshToken.split(" ")[1], process.env.JWT_SECRET!) as { _id: string }
        expect(_id).toBe(userId)
        token = response.body.refreshToken
    })


})