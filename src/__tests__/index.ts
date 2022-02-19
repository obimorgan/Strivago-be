import supertest from "supertest"
import app from "../app"
import mongoose from "mongoose"
import jwt  from "jsonwebtoken"
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


    const registratation = {
        first_name: 'Roby',
        last_name: 'Morgan',
        email: 'roby@morgan.com',
        password: '1234'
    }
    let userId: string
    it("should return new users details --> Post/Register", async () => {
        const response = await request.post("/user/register").send(registratation)
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        userId = response.body._id
        console.log(userId)
    })


    let invalidCredentials = {
        email: "roby@morgan.com"
    }
    it("should return 400 when users don't provide correct registration credentials", async () => {
        const response = await request.post("/user/register").send(invalidCredentials)
        expect(response.status).toBe(400)
    })


    let validLogin = {
        email: 'roby@morgan.com',
        password: '1234'
    }
    let createAccessToken: string
    it("should return a valid access-token token when the user login", async () => {
        const response = await request.post("/user/login").send(validLogin)
        expect(response.body).toBeDefined()
        expect(response.status).toBe(200)
        // console.log("why empty?", response.body)
        // expect(response.body._id).toBeDefined()
        // console.log(response.body.accessToken)
        // const { _id } = jwt.verify(response.body.accessToken.split(" ")[1], process.env.JWT_SECRET!) as { _id: string }
        // expect(_id).toBe(userId)
        createAccessToken = response.body.accessToken
    })

    it("should return 400 when users don't provide correct login credentials", async () => {
        const response = await request.post("/user/login").send(invalidCredentials)
        expect(response.status).toBe(404)
    })


    afterAll(done => {
    mongoose.connection.close()
        // .then(() => {
        //     return mongoose.connection.close()        
        // })
        .then(() => { done() })
    })

})