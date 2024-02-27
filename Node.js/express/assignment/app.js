const express = require('express');

const app = express();

// app.use((req, res, next) => {
// 	console.log('First middleware!');
// 	next();
// });

// app.use((req, res, next) => {
// 	console.log('Second middleware!');
// 	res.send('<h1>Hello express</h1>');
// });

app.use('/users', (req, res, next) => {
	console.log('/users page');
	res.send('<h1>/useres page</h1>');
});

app.use('/', (req, res, next) => {
	console.log('/ page');
	res.send('<h1>/ page</h1>');
});

app.listen(3000);
