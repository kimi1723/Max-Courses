const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.SENDGRID_API_KEY,
		},
	}),
);

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: req.flash('error'),
		notification: req.flash('notification'),
	});
};

exports.getSignup = async (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: req.flash('error'),
	});
};

exports.getResetPassword = async (req, res, next) => {
	res.render('auth/reset-password', {
		path: '/reset-password',
		pageTitle: 'Reset password',
		errorMessage: req.flash('error'),
	});
};

exports.getNewPassword = async (req, res, next) => {
	const { token } = req.params;

	try {
		const user = await User.findOne({ refreshToken: token, resetTokenExpiration: { $gt: Date.now() } });

		if (!user) {
			req.flash('error', 'Unexpected error');
			return res.redirect(`/new-password/${token}`);
		}

		res.render('auth/new-password', {
			path: '/new-password',
			pageTitle: 'New password',
			errorMessage: req.flash('error'),
			passwordToken: token,
			userId: user._id.toString(),
		});
	} catch (err) {
		console.log(err);

		req.flash('error', err);
		res.redirect(`/new-password/${token}`);
	}
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
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
		});
	}

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

		await transporter.sendMail({
			from: process.env.SENDGRID_EMAIL_SENDER,
			to: email,
			subject: 'Your account has been successfuly created',
			html: '<h1>Thank you for trusting us</h1>',
		});
	} catch (err) {
		console.log(err);
		console.log(err.response.body.errors);
	}
};

exports.postLogout = async (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};

exports.postResetPassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			req.flash('error', `Email doesn't exist`);
			return res.redirect('/reset-password');
		}

		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				console.log(err);
				req.flash('error', err);

				return res.redirect('/reset-password');
			}

			const token = buffer.toString('hex');

			user.refreshToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;

			await user.save();

			transporter.sendMail({
				to: email,
				from: process.env.SENDGRID_EMAIL_SENDER,
				subject: 'Password reset has been requested',
				html: `You have requested a password reset.
				<a href="http://localhost:3000/new-password/${token}">Click here</a> to reset password.`,
			});

			req.flash('notification', 'An email has been sent to you. Open it to update your password');
			res.redirect('/login');
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postNewPassword = async (req, res, next) => {
	const { password: newPassword, userId, passwordToken } = req.body;

	try {
		const user = await User.findOne({
			_id: userId,
			refreshToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() },
		});

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		user.password = hashedPassword;
		user.refreshToken = undefined;
		user.resetTokenExpiration = undefined;

		await user.save();

		req.flash('notification', 'Password updated successfuly');
		res.redirect('login');
	} catch (err) {
		console.log(err);
		req.flash('error', err);
		res.redirect(`/new-password/${token}`);
	}
};
