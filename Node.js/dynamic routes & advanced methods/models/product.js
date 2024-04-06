const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');
class Product {
	constructor({ title, price, description, imageUrl, id, userId }) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id && ObjectId.createFromHexString(id);
		this.userId = userId;
	}

	async save() {
		const db = getDb();
		let dbOp;

		try {
			if (this._id) {
				console.log(this._id);
				dbOp = await db.collection('products').updateOne({ _id: this._id }, { $set: this });
			} else {
				dbOp = await db.collection('products').insertOne(this);
			}

			console.log(dbOp);
		} catch (err) {
			console.log(err);
		}
	}

	static async fetchAll() {
		const db = getDb();

		try {
			const products = await db.collection('products').find().toArray();

			console.log(products);
			return products;
		} catch (err) {
			console.log(err);
		}
	}

	static async findById(id) {
		const db = getDb();

		try {
			const product = await db.collection('products').findOne({ _id: ObjectId.createFromHexString(id) });

			console.log(product);
			return product;
		} catch (err) {
			console.log(err);
		}
	}

	static async deleteById(id) {
		const db = getDb();

		try {
			await db.collection('products').deleteOne({ _id: ObjectId.createFromHexString(id) });

			console.log('Deleted!');
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Product;
