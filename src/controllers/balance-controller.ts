
import { IncomingMessage, ServerResponse } from 'http';
import { checkForValidSession } from '../models/auth-model';
import { listUserPermissions } from '../models/permissions-model';
import { BalanceResponse } from '../interfaces/auth-interfaces';
import { getBalance } from '../models/wallet-operations-model';

/**
 * Login Controller - handles the (req, res) login functionality.
 * Check passed username and password to the database and if they are correct ads new session for the user.
 * @param req http request object
 * @param res http response object
 */
export const balanceController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Check if we have a valid session
		const validSession = await checkForValidSession();
		const balanceResponse: BalanceResponse = {};
		if (validSession.valid === true) {
			// Session is valid
			// Make sure userId is number
			const userID = typeof validSession.userID !== 'number' ? Number(validSession.userID) : validSession.userID;
			const permissions = await listUserPermissions(userID);

			if (permissions.readCap === true) {
				// We have the correct permissions we can display the balance.
				const balance = await getBalance(userID);
				balanceResponse.balance = balance;
				res.writeHead(200, { "Content-Type": "application/json" });
			} else {
				// Currently all the users have read permissions so this case wont be hitted.
				res.writeHead(403, { "Content-Type": "application/json" });
				balanceResponse.msg = 'Your request has been denied, you do not have the correct permissions to view your balance. Please contact administrator if you need to view your balance.';
			}
		} else {
			// Session expired.
			res.writeHead(401, { "Content-Type": "application/json" });
			balanceResponse.msg = 'Unauthorized, user is not logged in or session is expired!'
		}
		res.end(JSON.stringify(balanceResponse));
	} catch (err) {
		throw err;
	}
}
