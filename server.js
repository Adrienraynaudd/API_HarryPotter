const ENV = require('./environment/environment');

// server
const http = require('http');
const port = ENV.PORT || 6000; 
const app = require('./app');

const server = http.createServer(app);

server.listen(port);


console.log('Server created');
console.log('Listen on port ' + port + '!');

