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
				};

				cart.products = [...cart.products, updatedProduct];
			}

			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(path, JSON.stringify(cart), err => {
				console.log(err);
			});
		});
	}
};
