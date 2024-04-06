require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { connectMongo } = require('./util/database');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
	try {
		const { name, email, cart, _id } = await User.findById(process.env.DB_MAIN_USER_ID);

		req.user = new User({ username: name, email, cart, _id });
		next();
	} catch (err) {
		console.log(err);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connectMongo(() => {
	app.listen(3000);
});
