const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.findAll();

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
		const product = await Product.findByPk(productId);

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
		const products = await Product.findAll();

		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCart = (req, res, next) => {
	Cart.getCart(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];

			for (const product of products) {
				const cartProductData = cart.products.find(prod => prod.id === product.id);

				if (cartProductData) {
					cartProducts.push({ productData: product, quantity: cartProductData.quantity });
				}
			}

			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;

	Product.findById(productId, product => {
		Cart.addProduct(productId, product.price);
	});

	res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
	const { productId, productPrice } = req.body;

	Cart.deleteProduct(productId, productPrice);

	res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
