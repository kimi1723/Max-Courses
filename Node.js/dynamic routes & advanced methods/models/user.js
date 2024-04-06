const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');
class User {
	constructor(username, email) {
		this.name = username;
		this.email = email;
	}

	async save() {
		const db = getDb();

		try {
			const res = await db.collection('users').insertOne(this);
		} catch (err) {
			console.log(err);
		}
	}

	static async findById(userId) {
		const db = getDb();

		try {
			const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });

			return user;
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = User;
