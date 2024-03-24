require('dotenv').config();

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(6);

		req.user = user;

		next();
	} catch (err) {
		console.log(err);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// sequelize
// 	// .sync({ force: true })
// 	.sync()
// 	.then(res => User.findByPk(6))
// 	.then(user => {
// 		if (!user) {
// 			User.create({ name: 'Max', email: 'test@test.com', password: 'test123' });
// 		}
// 		console.log(user);
// 		return Promise.resolve(user);
// 	})
// 	.then(user => {
// 		console.log(user);
// 		app.listen(3000);
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	});

const syncSequelize = async () => {
	try {
		await sequelize.sync();

		const user = await User.findByPk(6);

		if (!user) {
			User.create({ name: 'Max', email: 'test@test.com', password: 'test123' });
		}

		await user.createCart();

		app.listen(3000);
	} catch (err) {
		console.log(err);
	}
};

syncSequelize();
