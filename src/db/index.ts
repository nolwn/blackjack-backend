import { MongoClient, Db } from "mongodb";

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;

let mongo: MongoClient;

export const connectDB = async (): Promise<void> => {
	const connection = await MongoClient.connect(
		`mongodb://${user}:${password}@${host}:${port}/${database}`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	).catch(err => console.log("Database connection failed", err));

	if (isMongoClient(connection)) {
		mongo = connection;
	} else {
		throw new Error("Could not form database connection");
	}
};

export const getDB = (): Db => {
	return mongo.db(database);
};

export const closeDB = () => {
	mongo.close();
};

const isMongoClient = (
	connection: MongoClient | void
): connection is MongoClient => {
	return !!connection;
};
