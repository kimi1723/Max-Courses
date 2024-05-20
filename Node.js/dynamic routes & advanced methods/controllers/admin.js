const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postAddProduct = async (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product({ title, price, description, imageUrl, userId: req.user._id });

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
			isAuthenticated: req.session.isLoggedIn,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postEditProduct = async (req, res, next) => {
	const { productId, title, price, imageUrl, description } = req.body;

	try {
		const product = await Product.findById(productId);

		if (product.userId.toString() !== req.user._id.toString()) return res.redirect('/');

		Object.assign(product, { title, price, description, imageUrl });
		console.log(product);

		await product.save();

		console.log('Updated product');
		res.redirect('/admin/products');
	} catch (err) {
		console.log(err);
	}
};

exports.deleteProduct = async (req, res, next) => {
	const { productId } = req.params;

	try {
		await Product.deleteOne({ _id: productId, userId: req.user._id });

		console.log('Product destroyed');
		res.status(200).json({ message: 'Success!' });
	} catch (err) {
		res.status(500).json({ message: 'Deleting product failed!' });
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find({ userId: req.user._id });

		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
			isAuthenticated: req.session.isLoggedIn,
		});
	} catch (err) {
		console.log(err);
	}
};
