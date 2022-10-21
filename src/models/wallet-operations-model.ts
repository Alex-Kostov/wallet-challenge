import { db } from '../config/db-config';

/**
 * Fetches the balance for specific user from the database.
 * @param userID id of the user we would like to check balance for.
 * @returns returns the balance of the passed in user
 */
export const getBalance = async (userID: number): Promise<number> => {
	return new Promise((resolve, reject) => {
		db.query('SELECT balance FROM users WHERE id=?', userID, (err, result:{ [balance: string]: any } , fields) => {
			if (err) {
				reject(err);
			}
			resolve(Number(result[0].balance));
		});
	});
};