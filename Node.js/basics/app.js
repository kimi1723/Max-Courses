const http = require('http');
const { someText, handler } = require('./routes');

console.log(someText);

const server = http.createServer(handler);

server.listen(3000);
