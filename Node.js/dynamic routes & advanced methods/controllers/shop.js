const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();

		res.render('shop/index', {
			prods: products,
			pageTitle: 'All products',
			path: '/products',
			isAuthenticated: req.session.isLoggedIn,
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
			isAuthenticated: req.session.isLoggedIn,
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
			isAuthenticated: req.session.isLoggedIn,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCart = async (req, res, next) => {
	try {
		const {
			cart: { items: products },
		} = await req.session.user.populate('cart.items.productId');
		console.log(products);

		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Your Cart',
			products,
			isAuthenticated: req.session.isLoggedIn,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postCart = async (req, res, next) => {
	const productId = req.body.productId;

	try {
		const product = await Product.findById(productId);
		await req.session.user.addToCart(product);

		return res.redirect('/cart');
	} catch (err) {
		console.log(err);

		res.redirect('/404');
	}
};

exports.postCartDeleteProduct = (req, res, next) => {
	const { productId } = req.body;
	const { quantity } = req.query;

	req.session.user.removeFromCart({ productId, quantity });
	res.redirect('/cart');
};

exports.postOrder = async (req, res, next) => {
	try {
		const {
			cart: { items: products },
		} = await req.session.user.populate('cart.items.productId');

		const order = new Order({
			user: { name: req.session.user.name, userId: req.session.user },
			products: products.map(i => ({ quantity: i.quantity, productData: { ...i.productId._doc } })),
		});

		await order.save();
		await req.session.user.clearCart();

		res.redirect('/orders');
	} catch (err) {
		console.log(err);
		res.redirect('/error');
	}
};

exports.getOrders = async (req, res, next) => {
	const orders = await Order.find({ 'user.userId': req.session.user._id });

	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
		orders,
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
		isAuthenticated: req.session.isLoggedIn,
	});
};
