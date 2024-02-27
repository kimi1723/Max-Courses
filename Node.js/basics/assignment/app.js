const http = require('http');
const { handlers } = require('./routes');

const server = http.createServer(handlers);

server.listen(3000);
