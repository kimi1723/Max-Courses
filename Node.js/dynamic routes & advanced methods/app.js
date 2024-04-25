require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learning.p3olyab.mongodb.net/shop`;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store }));

app.use(async (req, res, next) => {
	if (!req.session.user) return next();

	try {
		const user = await User.findById(req.session.user._id);

		req.user = user;
		next();
	} catch (err) {
		console.log(err);
		redirect('/err');
	}
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

(async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		const user = User.findOne();

		if (!user) {
			const user = new User({
				name: 'Patrick',
				email: 'patrick@example.com',
				items: [],
			});

			user.save();
		}

		app.listen(3000);
	} catch (err) {
		console.log(err);
	}
})();
