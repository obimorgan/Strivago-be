import mongoose, {model} from "mongoose";
import bcrypt from "bcrypt";
import { userDocument, userModel } from './types'


const usersSchema = new mongoose.Schema<userDocument>({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    accessToken: String,
    refreshToken: String,
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newUser.password = hash;
  }

  next();
});


usersSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email }); 
  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password);
    if (isMatch) {
      console.log("Authentication  approoved")
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model<userDocument, userModel>("User", usersSchema)