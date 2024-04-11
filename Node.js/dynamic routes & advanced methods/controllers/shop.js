const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();

		res.render('shop/index', {
			prods: products,
			pageTitle: 'All products',
			path: '/products',
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getProduct = async (req, res, next) => {
	const productId = req.params.productId;

	try {
		const product = await Product.findById(productId);

		res.render('shop/product-detail', {
			product,
			pageTitle: product.title,
			path: `/products`,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.find();
		console.log(products);
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCart = async (req, res, next) => {
	try {
		const {
			cart: { items: products },
		} = await req.user.populate('cart.items.productId');
		console.log(products);

		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Your Cart',
			products,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postCart = async (req, res, next) => {
	const productId = req.body.productId;

	try {
		const product = await Product.findById(productId);
		await req.user.addToCart(product);

		return res.redirect('/cart');
	} catch (err) {
		console.log(err);

		res.redirect('/404');
	}
};

exports.postCartDeleteProduct = (req, res, next) => {
	const { productId } = req.body;
	const { quantity } = req.query;

	req.user.deleteProduct({ productId, quantity });
	res.redirect('/cart');
};

exports.postOrder = async (req, res, next) => {
	await req.user.addOrder();

	res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
	const orders = await req.user.getOrders();

	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
		orders,
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
