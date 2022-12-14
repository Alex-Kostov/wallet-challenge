import http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();
import { loginController, logoutController } from './controllers/auth-controller';
import { balanceController } from './controllers/balance-controller';
import { depositController, withdrawController, transactionsController } from './controllers/wallet-controller';
import { help } from './utils';

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
	// Set API endpoints
	const { method, url } = req;
	if ((url === '/' || url === '/help') && method === 'GET') {
		/**
		 * Help endpoint in case info is needed.
		 */
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(help, null, "\t"));
	} else if (url === '/auth/login' && method === 'POST') {
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
		/**
		 * Retrieves the user's latest 10 transactions if any.
		 */
		transactionsController(req, res, 10);
	} else if (url?.match(/\/wallet\/list\/\w+/) && method === 'GET') {
		/**
		 * Retrieves passed number of user transactions.
		 */

		// Validate the params.
		let limit: number = Number(url.split('/')[3]);
		if (isNaN(limit)) {
			limit = 10;
		}
		transactionsController(req, res, limit);
	} else if (url === '/wallet/deposit' && method === 'POST') {
		/**
		 * Deposit money to the user’s wallet (balance).
		 * The user needs permission to access this endpoint.
		 */
		depositController(req, res);
	} else if (url === '/wallet/withdraw' && method === 'POST') {
		/**
		 * Withdraw money from the user’s wallet (balance).
		 * The user needs permission to access this endpoint.
		 */
		withdrawController(req, res);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify('Something went wrong. Try accessing / or /help for more information.'));
	}
});

server.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});