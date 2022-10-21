import { db } from '../config/db-config';
import { Transaction } from '../interfaces/wallet-interfaces';

/**
 * Fetches the balance for specific user from the database.
 * @param userID id of the user we would like to check balance for.
 * @returns returns the balance of the passed in user
 */
export const getBalance = async (userID: number): Promise<number> => {
	return new Promise((resolve, reject) => {
		db.query('SELECT balance FROM users WHERE id=?', userID, (err, result: { [balance: string]: any }, fields) => {
			if (err) {
				reject(err);
			}
			resolve(Number(result[0].balance));
		});
	});
};

/**
 * Deposit money into user by id.
 * @param userID id of the user we would like to deposit money to.
 * @param amount amount of money we want to deposit.
 * @returns Returns a promise of deposit result.
 */
export const deposit = async (userID: number, amount: number): Promise<any> => {
	return new Promise((resolve, reject) => {
		db.query('UPDATE users SET balance=(balance + ?) WHERE id=?', [amount, userID], (err, result, fields) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}

/**
 * Withdraw money from user by id.
 * @param userID id of the user we would like to withdraw money to.
 * @param amount amount of money we want to withdraw.
 * @returns Returns a promise of withdraw result.
 */
export const withdraw = async (userID: number, amount: number): Promise<any> => {
	return new Promise((resolve, reject) => {
		db.query('UPDATE users SET balance=(balance - ?) WHERE id=?', [amount, userID], (err, result, fields) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}

/**
 * Ads new transaction into the database.
 * @param userID id of the user
 * @param transactionAmount amount of the transferred money.
 * @param transactionType type of the transaction deposit or withdraw.
 * @returns Promise of transaction result.
 */
export const newTransaction = async (userID: number, transactionAmount: number, transactionType: string): Promise<any> => {
	const transaction: Transaction = {
		user_id: userID,
		type: transactionType,
		amount: transactionAmount,
		time_created: new Date().toLocaleString()
	};

	return new Promise((resolve, reject) => {
		db.query('INSERT INTO transactions set ?', transaction, (err, result, fields) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}