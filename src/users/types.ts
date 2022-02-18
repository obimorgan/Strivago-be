import { Document, Model } from "mongoose"

export interface User {
    first_name: string
    last_name: string
    password: string
    email: string
    role: string
    refreshToken: string
}

export interface userDocument extends Document, User { }

export interface userModel extends Model<userDocument> {
    checkCredentials(email: string, password: string): Promise<userDocument | null>
}