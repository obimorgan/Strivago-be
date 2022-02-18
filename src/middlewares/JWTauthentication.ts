// import jwt from "jsonwebtoken";

// export const JWTAuthentication = async (user) => {
//   // Given the user returns an access token for him/her
//   const accessToken = await generateJWTToken({
//     _id: user._id,
//     role: user.role,
//   });
//   const refreshToken = await generateRefreshJWTToken({ _id: user._id });

//   // user is a mogoose document - so it can receieve the mongoose save() method
//   user.refreshToken = refreshToken;
//   await user.save();

//   // return both tokens
//   return { accessToken, refreshToken };
};