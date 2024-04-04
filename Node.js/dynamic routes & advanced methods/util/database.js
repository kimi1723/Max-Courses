const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const connectMongo = async callback => {
	try {
		const client = await MongoClient.connect(
			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learning.p3olyab.mongodb.net/shop`,
			// ?retryWrites=true
		);

		_db = client.db();

		callback(client);
	} catch (err) {
		console.log(err);
	}
};

const getDb = () => {
	if (_db) {
		return _db;
	}

	throw 'No database found!';
};

exports.connectMongo = connectMongo;
exports.getDb = getDb;
