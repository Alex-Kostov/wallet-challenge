import { db } from '../config/db-config';
import bcrypt from 'bcrypt';

export const login = (username: string, password: string, callback: any): any => {
	return db.query('SELECT * FROM users WHERE username=?', username, async (err, res: { [index: string]: any }, fields) => {
		if (err) {
			throw err;
		} else {
			if (res.length !== 0) {
				const hashedPassword = res[0].password;
				if (hashedPassword && password) {
					const passIsCorrected: boolean = await bcrypt.compare(password, hashedPassword);
					if (passIsCorrected) {
						// Create new row in session table

						// Return the result
						return callback(
							{
								msg: 'Username and password are correct',
								credentialMatches: true,
								statusCode: 200
							}
						);
					} else {
						return callback(
							{
								msg: 'Password is incorrect!',
								credentialMatches: false,
								statusCode: 403
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