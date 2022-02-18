import jwt from "jsonwebtoken";

process.env.TS_NODE_DEV && require("dotenv").config()
const { JWT_SECRET, REFRESH_JWT_SECRET } = process.env

export const JWTAuthentication = async (user: { _id: string; role: string; refreshToken: unknown; save: () => any; }) => {

  const accessToken = await generateJWTToken({
    _id: user._id,
    role: user.role,
  });
  const refreshToken = await generateRefreshJWTToken({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const generateJWTToken = (payload: string | object) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      JWT_SECRET as string,
      { expiresIn: "1m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
    );
  
const generateRefreshJWTToken = (payload: string | object) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      REFRESH_JWT_SECRET as string,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
    );
  
const verifyRefreshToken = (token: string) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, REFRESH_JWT_SECRET as string, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    })
  );