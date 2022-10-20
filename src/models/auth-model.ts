import { db } from '../config/db-config';
import bcrypt from 'bcrypt';
import { Session, LogoutResponse } from '../interfaces/auth-interfaces';
import { getTimestampsDiff } from '../utils';

export const login = (username: string, password: string, callback: any): any => {
	db.query('SELECT * FROM users WHERE username=?', username, async (err, res: { [index: string]: any }, fields) => {
		if (err) {
			throw err;
		} else {
			if (res.length !== 0) {
				const hashedPassword = res[0].password;
				if (hashedPassword && password) {
					const passIsCorrected: boolean = await bcrypt.compare(password, hashedPassword);
					const userID = res[0].id;
					if (passIsCorrected && userID) {
						return callback(
							{
								msg: 'Username and password are correct',
								credentialMatches: true,
								statusCode: 200,
								userID
							}
						);
					} else {
						return callback(
							{
								msg: 'Password is incorrect!',
								credentialMatches: false,
								statusCode: 403,
							}
						);
					}
				}
			} else {
				return callback(
					{
						msg: 'User does not exist!',
						credentialMatches: false,
						statusCode: 401
					}
				);
			}
		}
	});
}

export const addNewSession = (userID: number): void => {
	// Check add or update session for user
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

			// Delete sessions for other users
			db.query('DELETE FROM sessions WHERE user_id!=?', userID, (error, response, insertedFields) => {
				if (error) {
					throw error;
				}
				console.log('Sessions for other users have been deleted');
			});

			db.query('INSERT INTO sessions set ?', session, (error, response, insertedFields) => {
				if (error) {
					throw error;
				}
				console.log('New Session created successfully');
			});
		} else {
			// Update current Session
			const { id, user_id, time_created, time_updated }: Session = res[0];
			const timeUpdated = new Date(time_updated);
			const currentTime = new Date();

			// Check if current timestamp is higher that last updated date
			if (currentTime.getTime() > timeUpdated.getTime()) {
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

export const checkForValidSession = (callback: any) => {
	db.query('SELECT * FROM sessions', (err, res: { [index: string]: any }, fields) => {
		if (err) {
			throw err;
		}
		const response: LogoutResponse = {};
		if (res.length > 0) {
			const { id, user_id, time_created, time_updated }: Session = res[0];
			const diff = getTimestampsDiff(time_updated);
			if (Number(diff) > -1.00) {
				// Session is valid
				response.valid = true;
				response.sessionID = id;
				response.msg = 'Session is valid';
			} else {
				// Session is expired.
				// Delete Session
				deleteSession(Number(id));
				response.valid = false;
				response.sessionID = id;
				response.msg = 'Session is expired';
			}
		} else {
			response.valid = false;
			response.sessionID = null;
			response.msg = 'You are not authorized to access this endpoint! Please try to first login.';
		}
		return callback(response);
	});
}

export const deleteSession = (sessionID: number): void => {
	db.query('DELETE FROM sessions where id=?', sessionID, (err, res, fields) => {
		if (err) {
			throw err;
		}
		console.log(`Session with id: ${sessionID} was deleted successfully`);
	});
}
