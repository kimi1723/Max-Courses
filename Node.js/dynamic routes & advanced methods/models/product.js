const fs = require('fs');
const { getPath } = require('../util/path');

const path = getPath(['data'], 'products.json');

const getProductsFromFile = cb => {
	fs.readFile(path, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile(products => {
			if (this.id) {
				const existingProductIndex = products.findIndex(prod => prod.id === this.id);
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;

				fs.writeFile(path, JSON.stringify(updatedProducts), err => {
					console.log(err);
				});
			} else {
				this.id = new Date().getTime().toString() + Math.random().toString();

				products.push(this);
				fs.writeFile(path, JSON.stringify(products), err => {
					console.log(err);
				});
			}
		});
	}

	static delete(id, cb) {
		getProductsFromFile(products => {
			const existingProductIndex = products.findIndex(product => product.id === id);

			if (existingProductIndex === -1) {
				return cb({ error: true, message: 'Product not found!' });
			}

			const updatedProducts = [...products];
			updatedProducts.splice(existingProductIndex, 1);

			fs.writeFile(path, JSON.stringify(updatedProducts), err => console.log(err));
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}
};
