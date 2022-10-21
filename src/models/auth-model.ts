import { db } from '../config/db-config';
import bcrypt from 'bcrypt';
import { Session, LogoutResponse } from '../interfaces/auth-interfaces';
import { getTimestampsDiff } from '../utils';

/**
 * Checks the passed username and password against the database.
 * The return object contains (msg {string}, credentialMatches {boolean}, statusCode {number} and optionality userID).
 * If the username and password are correct we return status 200, else if the password is incorrect we return 403 and if the user is missing we return 401.
 * @param username {string} Username
 * @param password {string} Password
 */
export const login = (username: string, password: string): Promise<{ msg: string, credentialMatches: boolean, statusCode: number, userID?: number }> => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users WHERE username=?', username, async (err, res: { [index: string]: any }, fields) => {
			if (err) {
				reject(err);
			} else {
				// Check if the query has returned an user.
				if (res.length !== 0) {
					const hashedPassword = res[0].password;
					if (hashedPassword && password) {
						// Compare the passwords using the bcrypt compare function.
						const passIsCorrected: boolean = await bcrypt.compare(password, hashedPassword);
						const userID = res[0].id;
						if (passIsCorrected && userID) {
							// User with this username exists and the password matches.
							resolve(
								{
									msg: 'Username and password are correct',
									credentialMatches: true,
									statusCode: 200,
									userID
								}
							);
						} else {
							// User exist, however the password is incorrect.
							resolve(
								{
									msg: 'Password is incorrect!',
									credentialMatches: false,
									statusCode: 403,
								}
							);
						}
					}
				} else {
					// If we hit this if this mean there is not user matching the passed username.
					resolve(
						{
							msg: 'User does not exist!',
							credentialMatches: false,
							statusCode: 401
						}
					);
				}
			}
		});
	});
}

/**
 * Add new or update existing session by passed userID.
 * @param userID {number} ID of the user we would like to add/update session for.
 */
export const addNewSession = (userID: number): void => {
	// Check if we have any sessions for an user with this id.
	db.query('SELECT * FROM sessions WHERE user_id=?', userID, (err, res: { [index: string]: any }, fields) => {
		if (err) {
			throw err;
		} else if (res.length === 0) {
			// Create new session
			const session: Session = {
				user_id: userID,
				time_created: new Date().toLocaleString(),
				time_updated: new Date().toLocaleString()
			}

			/*
				Since by challenge requirements we do not pass any parameters for the logout request,
				we cannot know which user to logout so for now we logout all the users.
				Can be fixed later.
			*/
			// Delete all sessions for users except for the current user.
			db.query('DELETE FROM sessions WHERE user_id!=?', userID, (error, response, insertedFields) => {
				if (error) {
					throw error;
				}
				console.log('Sessions for other users have been deleted');
			});

			// Add new session for the passed user.
			db.query('INSERT INTO sessions set ?', session, (error, response, insertedFields) => {
				if (error) {
					throw error;
				}
				console.log('New Session created successfully');
			});
		} else {
			// If we are in this else this means that we have session for user with this id.
			const { id, user_id, time_created, time_updated }: Session = res[0];
			const timeUpdated: Date = new Date(time_updated);
			const currentTime: Date = new Date();

			// Check if current timestamp is higher that last updated date.
			if (currentTime.getTime() > timeUpdated.getTime()) {
				// Update the current Session.
				db.query('UPDATE sessions SET time_updated=? WHERE sessions.id=?', [currentTime.toLocaleString(), id], (error, response, insertedFields) => {
					if (error) {
						throw error;
					}
					console.log('Session updated successfully');
				});
			}
		}
	});
}

/**
 * Check for valid sessions.
 * We use this function to see if there are any logged in users.
 */
export const checkForValidSession = (): Promise<LogoutResponse> => {
	return new Promise((resolve, reject) => {
		// Select all sessions
		db.query('SELECT * FROM sessions', (err, res: { [index: string]: any }, fields) => {
			if (err) {
				reject(err);
			}
			const response: LogoutResponse = {};
			if (res.length > 0) {
				const { id, user_id, time_created, time_updated }: Session = res[0];

				// Get the difference between curren time and sessions last updated time.
				const diff = getTimestampsDiff(time_updated);
				if (Number(diff) > -1.00) {
					// Session is valid.
					response.valid = true;
					response.sessionID = id;
					response.userID = user_id;
					response.msg = 'Session is valid';
				} else {
					// Session is expired, delete session.
					deleteSession(Number(id));
					response.valid = false;
					response.sessionID = id;
					response.msg = 'Session is expired';
				}
			} else {
				response.valid = false;
				response.sessionID = null;
				response.msg = 'You are not authorized to access this endpoint! Please login first.';
			}
			resolve(response);
		});
	});
}

/**
 * Deletes session by passed session ID.
 * @param sessionID {number} session id
 */
export const deleteSession = (sessionID: number): void => {
	db.query('DELETE FROM sessions where id=?', sessionID, (err, res, fields) => {
		if (err) {
			throw err;
		}
		console.log(`Session with id: ${sessionID} was deleted successfully`);
	});
}
