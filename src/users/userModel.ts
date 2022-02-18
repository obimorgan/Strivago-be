import mongoose, {model} from "mongoose";
import bcrypt from "bcrypt";
import { userDocument, userModel } from './types'


const usersSchema = new mongoose.Schema<userDocument>({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    refreshToken: String,
  },
  { timestamps: true }
);

//Hashing functon -- returns a "hashed" values before its saved to the db
usersSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newUser.password = hash;
  }
  next();
});

//Projection to not display the password property
usersSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

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