const db = require('../util/database');
const Cart = require('./cart');

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	async save(res) {
		try {
			const { title, price, description, imageUrl } = this;

			const res = await db.execute(`INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)`, [
				title,
				price,
				imageUrl,
				description,
			]);

			return res;
		} catch (err) {
			if (res) {
				console.log(err);
				return res.render('404', { pageTitle: 'Something went wrong', path: '/404' });
			}

			return { error: true, errorData: err };
		}
	}

	static delete(id) {}

	static async fetchAll(res) {
		try {
			const data = await db.execute('SELECT * FROM products');

			return data;
		} catch (err) {
			if (res) {
				console.log(err);
				return res.render('404', { pageTitle: 'Something went wrong', path: '/404' });
			}

			return { error: true, errorData: err };
		}
	}

	static findById(id) {
		return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
	}
};
