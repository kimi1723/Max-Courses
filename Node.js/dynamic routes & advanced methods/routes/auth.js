const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);

router.post(
	'/signup',
	[
		check('email').isEmail().withMessage('Please enter a valid email.'),
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
