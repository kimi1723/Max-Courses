const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
	});
});

router.post('/add-product', (req, res, next) => {
	const { title } = req.body;

	products.push({
		title,
	});

	res.redirect('/');
});

exports.routes = router;
exports.products = products;
