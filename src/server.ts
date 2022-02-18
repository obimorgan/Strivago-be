import app from './app'
import { createServer } from "http";

const httpServer = createServer(app);

export default httpServer