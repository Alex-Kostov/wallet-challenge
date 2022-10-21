
import { IncomingMessage, ServerResponse } from 'http';
import { checkForValidSession } from '../models/auth-model';
import { listUserPermissions } from '../models/permissions-model';

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

		if (validSession.valid === true) {
			// Session is valid
			// Make sure userId is number
			const userID = typeof validSession.userID !== 'number' ? Number(validSession.userID) : validSession.userID;
			const permissions = await listUserPermissions(userID);
			console.log(permissions);
		} else {
			// Session expired.
			res.writeHead(401, { "Content-Type": "application/json" });
			validSession.msg = 'Unauthorized, user is not logged in or session is expired!'
		}
		res.end(JSON.stringify(validSession));
	} catch (err) {
		throw err;
	}
}
