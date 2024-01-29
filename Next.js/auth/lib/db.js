import { MongoClient } from 'mongodb';

const connectionString =
	'mongodb+srv://patrykskontakt:2WBG7n8JLjfDyzu1@learning.p3olyab.mongodb.net/auth-demo?retryWrites=true&w=majority';

export default async function connectToDatabase() {
	const client = await MongoClient.connect(connectionString);

	return client;
}
