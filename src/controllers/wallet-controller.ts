import { IncomingMessage, ServerResponse } from 'http';
import { Response } from '../interfaces/reusable-interfaces';
import { checkForValidSession, updateSession } from '../models/auth-model';
import { listUserPermissions } from '../models/permissions-model';
import { getPostData } from '../utils';
import { deposit, getBalance, withdraw, newTransaction, fetchTransactions } from '../models/wallet-operations-model';


/**
 * Handles the rest API for deposit.
 * Checks if the user session is valid.
 * Validate user input.
 * Calls deposit function and returns the new balance as response.
 * @param req Request object
 * @param res Response object
 */
export const depositController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Check if we have a valid session
		const validSession = await checkForValidSession();
		const depositResponse: Response = {};
		if (validSession.valid === true) {
			// Session is valid
			// Make sure userId is number
			const userID = typeof validSession.userID !== 'number' ? Number(validSession.userID) : validSession.userID;
			const permissions = await listUserPermissions(userID);

			if (permissions.writeCap === true) {
				// Get the post data.
				const data = await getPostData(req);
				let depositedAmount = Number(data.amount);

				// Validate the passed data.
				if (depositedAmount < 0) {
					depositedAmount = Math.abs(depositedAmount);
				}

				if (depositedAmount !== 0) {
					// Deposit the money
					await deposit(userID, depositedAmount);

					// Create new transaction
					await newTransaction(userID, depositedAmount, 'deposit');

					// Return new balance as response.
					const newBalance = await getBalance(userID);
					depositResponse.msg = 'Deposit successful. New balance is ' + newBalance;

					// Update the session
					updateSession(userID);

					res.writeHead(200, { "Content-Type": "application/json" });
				} else {
					depositResponse.msg = 'Deposit {amount} must be valid number, or it must not be zero.';
					res.writeHead(400, { "Content-Type": "application/json" });
				}
			} else {
				// Currently all the users have read permissions so this case wont be hitted.
				res.writeHead(403, { "Content-Type": "application/json" });
				depositResponse.msg = 'Your request has been denied, you do not have the correct permissions to deposit. Please contact administrator for more info.';
			}
		} else {
			// Session expired.
			res.writeHead(401, { "Content-Type": "application/json" });
			depositResponse.msg = 'Unauthorized, user is not logged in or session is expired!'
		}
		res.end(JSON.stringify(depositResponse));
	} catch (err) {
		throw err;
	}
}

/**
 * Handles the rest API for withdraw.
 * Checks if the user session is valid.
 * Validate user input.
 * Calls withdraw function and returns the new balance as response.
 * @param req Request object
 * @param res Response object
 */
export const withdrawController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Check if we have a valid session
		const validSession = await checkForValidSession();
		const withdrawResponse: Response = {};
		if (validSession.valid === true) {
			// Session is valid
			const userID = typeof validSession.userID !== 'number' ? Number(validSession.userID) : validSession.userID;
			const permissions = await listUserPermissions(userID);

			if (permissions.writeCap === true) {
				// Get the post data.
				const data = await getPostData(req);
				let withdrawAmount = Number(data.amount);

				const currentBalance = await getBalance(userID);

				if (currentBalance >= withdrawAmount) {
					// Validate the passed data.
					if (withdrawAmount < 0) {
						withdrawAmount = Math.abs(withdrawAmount);
					}

					if (withdrawAmount !== 0) {
						// Withdraw the money
						await withdraw(userID, withdrawAmount);

						// Create new transaction
						await newTransaction(userID, withdrawAmount, 'withdraw');

						withdrawResponse.msg = 'Withdraw successful. New balance is ' + (currentBalance - withdrawAmount);

						// Update the session
						updateSession(userID);

						res.writeHead(200, { "Content-Type": "application/json" });
					} else {
						withdrawResponse.msg = 'Withdraw {amount} must be valid number, or it must not be zero.';
						res.writeHead(400, { "Content-Type": "application/json" });
					}

				} else {
					withdrawResponse.msg = 'Insufficient Funds';
					res.writeHead(400, { "Content-Type": "application/json" });
				}
			} else {
				// Currently all the users have read permissions so this case wont be hitted.
				res.writeHead(403, { "Content-Type": "application/json" });
				withdrawResponse.msg = 'Your request has been denied, you do not have the correct permissions to withdraw. Please contact administrator for more info.';
			}
		} else {
			// Session expired.
			res.writeHead(401, { "Content-Type": "application/json" });
			withdrawResponse.msg = 'Unauthorized, user is not logged in or session is expired!'
		}
		res.end(JSON.stringify(withdrawResponse));
	} catch (err) {
		throw err
	}
}

/**
 * Handles the rest API for listing the latest transactions.
 * @param req Request object
 * @param res Response object
 * @param limit the number of transactions we want to fetch
 */
export const transactionsController = async (req: IncomingMessage, res: ServerResponse, limit: number): Promise<void> => {
	try {
		// Check if we have a valid session
		const validSession = await checkForValidSession();
		const transactionResponse: Response = {};
		if (validSession.valid === true) {
			// Session is valid
			const userID = typeof validSession.userID !== 'number' ? Number(validSession.userID) : validSession.userID;
			const permissions = await listUserPermissions(userID);

			if (permissions.writeCap === true) {
				const transactions = await fetchTransactions(userID, limit);

				transactionResponse.transactions = transactions;

				// Update the session
				updateSession(userID);

				res.writeHead(200, { "Content-Type": "application/json" });
			} else {
				// Currently all the users have read permissions so this case wont be hitted.
				res.writeHead(403, { "Content-Type": "application/json" });
				transactionResponse.msg = 'Your request has been denied, you do not have the correct permissions to view transactions. Please contact administrator for more info.';
			}
		} else {
			// Session expired.
			res.writeHead(401, { "Content-Type": "application/json" });
			transactionResponse.msg = 'Unauthorized, user is not logged in or session is expired!'
		}
		res.end(JSON.stringify(transactionResponse));
	} catch (err) {
		throw err;
	}
}