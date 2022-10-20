
import { IncomingMessage, ServerResponse } from 'http';
import { getPostData } from '../utils';
import { login, addNewSession, checkForValidSession, deleteSession } from '../models/auth-model';

export const loginController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	// Check if req username and password are present in the database
	// If we pass the check above we need to create new session for the user.
	try {
		const body: any = await getPostData(req);
		if (body.username && body.password) {
			login(body.username, body.password, (result: any) => {
				if (result.statusCode === 200) {
					// Create new row in session table
					addNewSession(result.userID);
				}

				res.writeHead(result.statusCode, { "Content-Type": "application/json" });
				res.end(JSON.stringify(result));
			});
		} else {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify('Something went wrong. Check if the request body contains username and password fields.'));
		}
	} catch (err) {
		throw err;
	}
}

export const logoutController = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
	try {
		// Check if we have valid session, it also deletes expired sessions.
		checkForValidSession((result: any) => {
			if (result.valid === true) {
				try {
					deleteSession(result.sessionID);
					result.logout = 'successful';
				} catch (err) {
					throw err;
				}
				res.writeHead(200, { "Content-Type": "application/json" });
			} else {
				res.writeHead(401, { "Content-Type": "application/json" });
			}
			res.end(JSON.stringify(result));
		});
	} catch (err) {
		throw (err);
	}
}
