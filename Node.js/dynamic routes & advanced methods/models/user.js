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

userSchema.methods.removeFromCart = function ({ productId, quantity }) {
	const cartItems = this.cart.items;
	const productQuantity = cartItems.find(i => i.productId.toString() === productId.toString()).quantity;

	try {
		if (quantity === 'all' || quantity >= productQuantity) {
			updatedCartItems = cartItems.filter(i => i.productId.toString() !== productId.toString());
		} else {
			const index = cartItems.findIndex(i => i.productId.toString() === productId.toString());

			cartItems[index].quantity = productQuantity - 1;
			updatedCartItems = cartItems;
		}

		this.cart.items = updatedCartItems;

		return this.save();
	} catch (err) {
		console.log(err);
	}
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };

	return this.save();
};

module.exports = mongoose.model('User', userSchema);
