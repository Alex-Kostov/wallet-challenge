
import { IncomingMessage, ServerResponse } from 'http';
import { getPostData } from '../utils';
import { login, addNewSession, checkForValidSession, deleteSession } from '../models/auth-model';

/**
 * Login Controller - handles the (req, res) login functionality.
 * Check passed username and password to the database and if they are correct ads new session for the user.
 * @param req http request object
 * @param res http response object
 */
export const loginController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Get the post Body as JSON.
		const body: any = await getPostData(req);
		if (body.username && body.password) {
			// If username and password are passed we try to login.
			const loginResult = await login(body.username, body.password);

			if (loginResult.statusCode === 200) {
				// Make sure userId is number
				const userID = typeof loginResult.userID !== 'number' ? Number(loginResult.userID) : loginResult.userID;

				// Create new row in session table
				addNewSession(userID);
			}

			res.writeHead(loginResult.statusCode, { "Content-Type": "application/json" });
			res.end(JSON.stringify(loginResult));
		} else {
			// if we hit this if then in the request body username or password is missing.
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify('Something went wrong. Check if the request body contains username and password fields.'));
		}
	} catch (err) {
		throw err;
	}
}

/**
 * Logout Controller - handles the (req, res) logout functionality
 * Removes the session of the current user.
 * This functions also removes expired sessions for all users.
 * @param req http request object
 * @param res http response object
 */
export const logoutController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Check if we have valid session
		const validSession = await checkForValidSession();

		if (validSession.valid === true) {
			// Make sure sessionID is number
			const sessionID = typeof validSession.sessionID !== 'number' ? Number(validSession.sessionID) : validSession.sessionID;

			// If we have valid session we remove it, this way we logout the user.
			deleteSession(sessionID);
			validSession.logout = 'successful';
			res.writeHead(200, { "Content-Type": "application/json" });
		} else {
			res.writeHead(401, { "Content-Type": "application/json" });
		}
		res.end(JSON.stringify(validSession));
	} catch (err) {
		throw (err);
	}
}
