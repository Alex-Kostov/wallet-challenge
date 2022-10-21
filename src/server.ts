import http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();
import { loginController, logoutController } from './controllers/auth-controller';
import { balanceController } from './controllers/balance-controller';

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
	// Set API endpoints
	const { method, url } = req;
	if (url === '/auth/login' && method === 'POST') {
		/**
		 * Login the user if the credentials are correct and create new session.
		 */
		loginController(req, res);
	} else if (url === '/auth/logout' && method === 'POST') {
		/**
		 * Logout the user by removing his session.
		 */
		logoutController(req, res);
	} else if (url === '/users/balance' && method === 'GET') {
		/**
		 * Retrieves the user’s current balance.
		 * The user must have a specific permission to read their balance and request it.
		 */
		balanceController(req, res);
	} else if (url === '/wallet/list' && method === 'GET') {

	} else if (url === '/wallet/withdraw' && method === 'GET') {

	} else if (url === '/wallet/deposit' && method === 'GET') {

	} else {

	}
});

server.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});