import http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();
import { loginController, logoutController } from './controllers/auth-controller';

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
	// Set API endpoints
	const { method, url } = req;
	if (url === '/auth/login' && method === 'POST') {
		loginController(req, res);
	} else if (url === '/auth/logout' && method === 'POST') {
		logoutController(req, res);
	} else if (url === '/users/balance' && method === 'GET') {
		//response headers
		res.writeHead(200, { 'Content-Type': 'application/json' });
		//set the response
		res.write('Hi there, This is a Vanilla Node.js API');
		//end the response
		res.end();
	} else if (url === '/wallet/list' && method === 'GET') {
		//response headers
		res.writeHead(200, { 'Content-Type': 'application/json' });
		//set the response
		res.write('Hi there, This is a Vanilla Node.js API');
		//end the response
		res.end();
	} else if (url === '/wallet/withdraw' && method === 'GET') {
		//response headers
		res.writeHead(200, { 'Content-Type': 'application/json' });
		//set the response
		res.write('Hi there, This is a Vanilla Node.js API');
		//end the response
		res.end();
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: 'Route not found' }));
	}
});

server.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});