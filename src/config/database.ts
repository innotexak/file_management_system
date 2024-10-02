import mongoose from "mongoose";
// import * as mongoose from "mongoose";
import dotenv from "dotenv";
import DefaultScripts from "../defaultScript.js";

dotenv.config();

const options = {
  serverSelectionTimeoutMS: 30000, // Defaults to 30000 (30 seconds)
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class db {
  private readonly log: any;
  constructor(log: any) {
    this.log = log;
  }

  public connect(DB_URL: string) {
    const log = this.log;
    mongoose.set("strictQuery", false);
    mongoose
      .connect(DB_URL, options)
      .then(async () => {
        log.info(`Successfully connected to `, DB_URL);
        new DefaultScripts();
        //
        // setTimeout(()=>{
        //   eventEmitter.emit(RunIndexSync);
        // }, 60*1000)

      })
      .catch((err: any) => {
        log.error(`There was a db connection error`, err);
        process.exit(0);
      });

    mongoose.connection.once("disconnected", () => {
      log.error(`Successfully disconnected from ${DB_URL}`);
    });
    process.on("SIGINT", () => {
      mongoose.connection.close().then(() => {
        log.error("dBase connection closed due to app termination");
        process.exit(0);
      });
    });
  }
}

export default db;
