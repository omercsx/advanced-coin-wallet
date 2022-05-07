import mongoose from "mongoose";

import { jobHandlerConfig } from "../config";

export abstract class ConnectionHelper {
  private static initalConnection: Promise<typeof mongoose>;

  public static async connect() {
    ConnectionHelper.initalConnection = mongoose.connect(jobHandlerConfig.mongoUrl);
    await ConnectionHelper.initalConnection;
    return;
  }

  public static async getConnection() {
    return await ConnectionHelper.initalConnection;
  }

  public static async getNativeClient() {
    const connection = await ConnectionHelper.initalConnection;
    return connection.connection.getClient();
  }
}
