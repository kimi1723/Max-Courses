const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
				quantity: { type: Number, required: true },
			},
		],
	},
});

userSchema.methods.addToCart = async function (product) {
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

	this.cart = updatedCart;

	try {
		return await this.save();
	} catch (err) {
		console.log(err);
	}
};

module.exports = mongoose.model('User', userSchema);

// class User {
// 	constructor({ username, email, cart, _id }) {
// 		this.name = username;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = _id;
// 	}

// 	async save() {
// 		const db = getDb();

// 		try {
// 			const res = await db.collection('users').insertOne(this);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	async addToCart(product) {

// 	}

// 	async getCart() {
// 		const db = getDb();
// 		const productIds = this.cart.items.map(item => item.productId);

// 		try {
// 			const products = await db
// 				.collection('products')
// 				.find({ _id: { $in: productIds } })
// 				.toArray();

// 			return products.map(p => ({
// 				...p,
// 				quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity,
// 			}));
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	async deleteProduct({ productId, quantity }) {
// 		const db = getDb();
// 		const cartItems = this.cart.items;
// 		const productQuantity = cartItems.find(i => i.productId.toString() === productId.toString()).quantity;
// 		let updatedCartItems;

// 		try {
// 			if (quantity === 'all' || quantity >= productQuantity) {
// 				updatedCartItems = cartItems.filter(i => i.productId.toString() !== productId.toString());
// 			} else {
// 				const index = cartItems.findIndex(i => i.productId.toString() === productId.toString());

// 				cartItems[index].quantity = productQuantity - 1;
// 				updatedCartItems = cartItems;
// 			}

// 			const updatedCart = {
// 				items: updatedCartItems,
// 			};

// 			const res = await db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });

// 			console.log(res);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	async addOrder() {
// 		const db = getDb();

// 		try {
// 			const products = await this.getCart();

// 			const order = {
// 				user: {
// 					_id: this._id,
// 					name: this.name,
// 					email: this.email,
// 				},
// 				items: products,
// 			};

// 			await db.collection('orders').insertOne(order);
// 			this.cart.items = [];

// 			const res = await db.collection('users').updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
// 			console.log(res);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	async getOrders() {
// 		const db = getDb();

// 		try {
// 			const res = await db.collection('orders').find({ 'user._id': this._id }).toArray();

// 			return res;
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	static async findById(userId) {
// 		const db = getDb();

// 		try {
// 			const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });

// 			return user;
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// }

// module.exports = User;
