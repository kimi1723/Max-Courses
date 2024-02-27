const fs = require('fs');

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write(
			'<html> <head><title>My First Page</title></head><body><h1>First Page es</h1><form action="/message" method="POST"><input type="text" name="message"/><input type="submit" value="send" /></form></body></html>',
		);
		return res.end();
	}

	if (url === '/message' && method === 'POST') {
		const body = [];

		req.on('data', chunk => body.push(chunk));

		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];

			fs.writeFile('message.txt', message, err => {
				res.statusCode = 302;
				res.setHeader('Location', '/');

				return res.end();
			});
		});

		return;
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html> <head><title>My First Page</title></head><body><h1>First Page es</h1></body></html>');
	res.end();
};

module.exports = {
	handler: requestHandler,
	someText: 'Hard coded',
};
