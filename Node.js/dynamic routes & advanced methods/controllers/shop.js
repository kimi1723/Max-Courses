const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();

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
		const products = await Product.fetchAll();

		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
		});
	} catch (err) {
		console.log(err);
	}
};

// exports.getCart = async (req, res, next) => {
// 	try {
// 		const cart = await req.user.getCart();
// 		const products = await cart.getProducts();

// 		res.render('shop/cart', {
// 			path: '/cart',
// 			pageTitle: 'Your Cart',
// 			products,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// exports.postCart = async (req, res, next) => {
// 	const productId = req.body.productId;

// 	try {
// 		const cart = await req.user.getCart();
// 		const cartProducts = await cart.getProducts({ where: { id: productId } });

// 		let cartProduct;

// 		if (cartProducts.length > 0) {
// 			[cartProduct] = cartProducts;
// 		}

// 		let newQuantity = 1;

// 		if (cartProduct) {
// 			const oldQuantity = cartProduct.cartItem.quantity;
// 			newQuantity = oldQuantity + 1;

// 			await cart.addProduct(cartProduct, { through: { quantity: newQuantity } });
// 		} else {
// 			const product = await Product.findByPk(productId);

// 			await cart.addProduct(product, { through: { quantity: newQuantity } });
// 		}

// 		return res.redirect('/cart');
// 	} catch (err) {
// 		console.log(err);

// 		res.redirect('/404');
// 	}
// };

// exports.postCartDeleteProduct = (req, res, next) => {
// 	const { productId, productPrice } = req.body;

// 	Cart.deleteProduct(productId, productPrice);

// 	res.redirect('/cart');
// };

// exports.getOrders = (req, res, next) => {
// 	res.render('shop/orders', {
// 		path: '/orders',
// 		pageTitle: 'Your Orders',
// 	});
// };

// exports.getCheckout = (req, res, next) => {
// 	res.render('shop/checkout', {
// 		path: '/checkout',
// 		pageTitle: 'Checkout',
// 	});
// };
