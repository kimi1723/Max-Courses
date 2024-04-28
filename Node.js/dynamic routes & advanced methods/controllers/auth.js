const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: req.flash('error'),
	});
};

exports.getSignup = async (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: this.getSignup,
		isAuthenticated: false,
		errorMessage: req.flash('error'),
	});
};

exports.postLogin = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			req.flash('error', 'Invalid credentials');
			return res.redirect('/login');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			req.flash('error', 'Invalid credentials');
			return res.redirect('/login');
		}

		req.session.user = user;
		req.session.isLoggedIn = true;
		req.session.save(err => {
			console.log(err);

			res.redirect('/');
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postSignup = async (req, res, next) => {
	const { email, password, confirmPassword } = req.body;

	try {
		const isUser = await User.findOne({ email: email });

		if (isUser) {
			req.flash('error', 'Email already in use');
			return res.redirect('/signup');
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			email,
			password: hashedPassword,
			cart: { items: [] },
		});

		await user.save();

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
