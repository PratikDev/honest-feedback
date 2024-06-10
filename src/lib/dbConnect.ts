import mongoose from "mongoose";
import { getEnv } from "./utils";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Using existing database connection");
		return;
	}

	try {
		const db = await mongoose.connect(getEnv("MONGOOSE_URL") || "", {});
		connection.isConnected = db.connections[0].readyState;
		console.log("New database connection");
	} catch (error) {
		console.log("Error connecting to database: ", error);
		process.exit(1);
	}
}

export default dbConnect;
