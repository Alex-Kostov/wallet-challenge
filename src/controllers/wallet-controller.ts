import { IncomingMessage, ServerResponse } from 'http';
import { Response } from '../interfaces/reusable-interfaces';
import { checkForValidSession } from '../models/auth-model';
import { listUserPermissions } from '../models/permissions-model';
import { getPostData } from '../utils';
import { deposit, getBalance } from '../models/wallet-operations-model';


/**
 * Handles the rest API for deposit.
 * Checks if the user session is valid.
 * Validate user input.
 * Calls deposit functions and returns the new balance as response.
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
					const newBalance = await getBalance(userID);
					depositResponse.msg = 'Deposit successful. New balance is ' + newBalance;
					res.writeHead(200, { "Content-Type": "application/json" });
				} else {
					depositResponse.msg = 'Deposit {amount} must be valid number, or it must not be zero.';
					res.writeHead(400, { "Content-Type": "application/json" });
				}
			} else {
				// Currently all the users have read permissions so this case wont be hitted.
				res.writeHead(403, { "Content-Type": "application/json" });
				depositResponse.msg = 'Your request has been denied, you do not have the correct permissions deposit. Please contact administrator for more info.';
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
