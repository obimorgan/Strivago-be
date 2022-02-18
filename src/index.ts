import mongoose from 'mongoose'
import httpServer from './server'

process.env.TS_NODE_DEV && require("dotenv").config()

const { MONGO_CONNECTION } = process.env
if (!MONGO_CONNECTION) throw new Error("No Mongo URL provided")
const PORT = 3002

mongoose.connect(MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo");
  httpServer.listen(PORT, () => {
    console.log("Server listens to port:", PORT);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});


