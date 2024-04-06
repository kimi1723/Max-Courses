const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');
class User {
	constructor({ username, email, cart, _id }) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = _id;
	}

	async save() {
		const db = getDb();

		try {
			const res = await db.collection('users').insertOne(this);
		} catch (err) {
			console.log(err);
		}
	}

	async addToCart(product) {
		const cartItems = this.cart.items;

		const cartProductIndex = cartItems.findIndex(cp => cp.productId.toString() === product._id.toString());
		const updatedCartItems = [...cartItems];
		let newQuantity = 1;

		if (cartProductIndex >= 0) {
			newQuantity = cartItems[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({ productId: product._id, quantity: newQuantity });
		}

		const updatedCart = {
			items: updatedCartItems,
		};

		const db = getDb();

		try {
			return await db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
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
