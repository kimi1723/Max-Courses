const { getDb } = require('../util/database');
class Product {
	constructor(title, price, description, imageUrl) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	async save() {
		const db = getDb();

		try {
			const res = await db.collection('products').insertOne(this);

			console.log(res);
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
}

module.exports = Product;
