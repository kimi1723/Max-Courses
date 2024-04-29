const express = require('express');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post(
	'/login',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.custom(async (value, { req }) => {
				const userDoc = await User.findOne({ email: value });

				if (!userDoc) throw new Error(`User doesn't exist`);

				return true;
			}),
		check('password').custom(async (value, { req }) => {
			const { email } = req.body;
			const user = await User.findOne({ email });

			const isValidPassword = await bcrypt.compare(value, user.password);

			if (!isValidPassword) throw new Error('Invalid password');

			return true;
		}),
	],
	authController.postLogin,
);

router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom(async (value, { req }) => {
				const userDoc = await User.findOne({ email: value });

				if (userDoc) throw new Error('User with this email exists already');

				return true;
			}),
		body('password', 'Password must be at least 5 characters long containing only numbers and text')
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match');
			}

			return true;
		}),
	],
	authController.postSignup,
);

router.post('/logout', authController.postLogout);

router.post('/reset-password', authController.postResetPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
