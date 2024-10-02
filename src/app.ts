import { config } from "dotenv";
import express, {Request, Response, NextFunction} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import packageJson from "../package.json" assert { type: "json" };
import {Document, ObjectId} from "mongoose";
import router from "./route.js";
import bodyParser from "body-parser";
import db from "./config/database.js";
import {MONGO_URL} from "./config/config.js";

config();
declare global {
	type LeanDocument<T> = T & Document;

	interface IValidatedKeys {
		isTest: boolean;
		serviceId?: ObjectId;
	}
}

const app = express();

const corsOptions = {
	origin: [
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:3002",
		"https://staging-kyc.netapps.ng",
		"https://kyc.netapps.ng",
		"https://kyc-verify.netapps.ng",
		"https://staging-kyc-verify.netapps.ng",
	],
	credentials: true,
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"x-public-key",
		"x-secret-key",
		"x-token",
	],
};

app.use(cookieParser());
app.use(cors<cors.CorsRequest>(corsOptions));


new db(console).connect(MONGO_URL as string);

app.get("/", (req, res) => {
	res.json({ name: packageJson.name, version: packageJson.version });
});

//SERVER HAND-CHECK
app.use('/api/v1', bodyParser.json({limit:'5mb'}), router);


const PORT = process.env.PORT

await new Promise<void>((resolve) =>
	app.listen(PORT)
);

console.log(`🚀 Server ready at http://localhost:${PORT}`);
