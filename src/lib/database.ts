import { env } from "@/env";
import mongoose from "mongoose";
import { logger } from "./logger";

interface CustomConnection extends mongoose.Connection {
  isConnected?: boolean;
}
const connection: CustomConnection = {} as CustomConnection;

export async function connectToDb() {
  try {
    if (connection.isConnected) {
      logger.debug("Using existing connection!");
      return;
    }
    const db: typeof mongoose = await mongoose.connect(env.MONGO);
    connection.isConnected = db.connections[0]!.readyState === 1;
    logger.info("Database connected!");
  } catch (err) {
    logger.error(`Error connecting to database! ${err}`);
    throw err;
  }
}
