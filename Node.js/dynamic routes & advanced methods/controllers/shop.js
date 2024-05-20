const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

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
	const page = +req.query.page || 1;

	try {
		const totalProducts = await Product.find().countDocuments();
		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);

		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
			totalProducts,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
			hasPrevious: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
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

	req.user.removeFromCart({ productId, quantity });
	res.redirect('/cart');
};

exports.postOrder = async (req, res, next) => {
	try {
		const {
			cart: { items: products },
		} = await req.user.populate('cart.items.productId');

		const order = new Order({
			user: { name: req.user.email, userId: req.user },
			products: products.map(i => ({ quantity: i.quantity, productData: { ...i.productId._doc } })),
		});

		await order.save();
		await req.user.clearCart();

		res.redirect('/orders');
	} catch (err) {
		console.log(err);
		res.redirect('/error');
	}
};

exports.getOrders = async (req, res, next) => {
	const orders = await Order.find({ 'user.userId': req.user._id });

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
