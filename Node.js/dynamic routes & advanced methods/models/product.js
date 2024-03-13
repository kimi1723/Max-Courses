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
	constructor(title, imageUrl, description, price) {
		this.id = new Date().getTime().toString() + Math.random().toString();
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(path, JSON.stringify(products), err => {
				console.log(err);
			});
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
