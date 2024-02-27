const { writeFile } = require('fs');

const writeHtmlHandler = ({ title, body, res }) => {
	res.setHeader('Content-Type', 'text/html');
	res.statusCode = 200;

	res.write('<html>');
	res.write(`<head><title>${title}</title></head>`);
	res.write(`<body>${body}</body>`);
	res.write('</html>');

	return res.end();
};

const defaultRouteHandler = (req, res) => {
	writeHtmlHandler({
		title: 'Greetings',
		body: "<h1>Greetings from Node.js!</h1><form action='/create-user' method='POST'><input type='text' name='username'/><button>Create user</button></form>",
		res,
	});
};

const usersRouteHandler = (req, res) => {
	writeHtmlHandler({
		title: 'Users',
		body: '<h1>Users</h1><ul><li>User 1</li><li>User 2</li></ul>',
		res,
	});
};

const createUserRouteHandler = (req, res) => {
	const method = req.method;

	if (method === 'POST') {
		const data = [];

		req.on('data', chunk => data.push(chunk));

		req.on('end', () => {
			const parsedBody = Buffer.concat(data).toString();
			const username = parsedBody.split('=')[1];

			writeFile('user.txt', username, err => {
				if (err) {
					console.log(err);
				} else {
					res.statusCode = 302;
					res.setHeader('Location', '/');
				}

				return res.end();
			});
		});
	}
};

const requestHandlers = (req, res) => {
	const url = req.url;

	switch (url) {
		case '/': {
			defaultRouteHandler(req, res);
			break;
		}
		case '/create-user': {
			createUserRouteHandler(req, res);
			break;
		}
		case '/users': {
			usersRouteHandler(req, res);
			break;
		}
	}
};

module.exports = {
	handlers: requestHandlers,
};
