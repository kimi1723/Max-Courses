const { ObjectId } = require('mongodb');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = async (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(title, price, description, imageUrl);

	try {
		await product.save();

		console.log('Created product');

		res.redirect('/admin/products');
	} catch (err) {
		console.log(err);
	}
};

exports.getEditProduct = async (req, res, next) => {
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}

	const productId = req.params.productId;

	try {
		const product = await Product.findById(productId);

		if (!product) {
			return res.redirect('/admin/products');
		}

		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/products',
			editing: editMode,
			product,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postEditProduct = async (req, res, next) => {
	const { productId, title, price, imageUrl, description } = req.body;

	try {
		const product = new Product(title, price, description, imageUrl, productId);

		await product.save();

		console.log('Updated product');
		res.redirect('/admin/products');
	} catch (err) {
		console.log(err);
	}
};

exports.postDeleteProduct = async (req, res, next) => {
	const { productId } = req.body;

	try {
		const product = await Product.findByPk(productId);

		await product.destroy();
		console.log('Product destroyed');
		res.redirect('/admin/products');
	} catch (err) {
		console.log(err);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();

		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	} catch (err) {
		console.log(err);
	}
};
