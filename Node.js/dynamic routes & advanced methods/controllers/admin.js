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
	const product = new Product(null, title, imageUrl, description, price);
	const es = await product.save();
	console.log(es);

	res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	const productId = req.params.productId;

	Product.findById(productId, product => {
		if (!product) {
			return res.redirect('/admin/products');
		}

		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/products',
			editing: editMode,
			product,
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const { productId, title, price, imageUrl, description } = req.body;
	const updatedProduct = new Product(productId, title, imageUrl, description, price);

	updatedProduct.save();

	res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
	const { productId } = req.body;

	Product.delete(productId, err => {
		if (err) {
			return console.log(err);
		}
	});

	res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};
