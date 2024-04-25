const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false,
	});
};

exports.postLogin = async (req, res, next) => {
	try {
		const user = await User.findById(process.env.DB_MAIN_USER_ID);

		req.session.user = user;
		req.session.isLoggedIn = true;

		res.redirect('/');
	} catch (err) {
		console.log(err);
	}
};
exports.postLogout = async (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};
