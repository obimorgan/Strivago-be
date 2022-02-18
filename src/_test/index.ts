import supertest from "supertest"
import app from "../app"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const request = supertest(app)

describe("Testing connection to mongoDB", () => {

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
})