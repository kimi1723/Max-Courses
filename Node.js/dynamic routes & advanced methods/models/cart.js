const fs = require('fs');
const { getPath } = require('../util/path');

const path = getPath(['data'], 'cart.json');

module.exports = class Cart {
	static addProduct(id, productPrice) {
		fs.readFile(path, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };

			if (!err) {
				cart = JSON.parse(fileContent);
			}

			const existingProductIndex = cart.products.findIndex(p => p.id === id);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;

			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.quantity = updatedProduct.quantity + 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = {
					id,
					quantity: 1,
					price: +productPrice,
				};

				cart.products = [...cart.products, updatedProduct];
			}

			cart.totalPrice = cart.totalPrice + +productPrice;

			fs.writeFile(path, JSON.stringify(cart), err => {
				if (err) {
					console.log(err);
				}
			});
		});
	}

	static deleteProduct(id, productPrice) {
		fs.readFile(path, (err, fileContent) => {
			if (err) {
				return console.log(err);
			}

			const cart = JSON.parse(fileContent);
			const updatedCart = { ...cart };
			const product = updatedCart.products.find(prod => prod.id === id);

			if (!product) {
				return;
			}

			const productQuantity = product.quantity;

			updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
			updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;

			fs.writeFile(path, JSON.stringify(updatedCart), err => {
				console.log(err);
			});
		});
	}

	static getCart(cb) {
		fs.readFile(path, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if (err) {
				cb(null);
			} else {
				cb(cart);
			}
		});
	}
};
