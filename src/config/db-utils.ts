/*
The database must have a users table, sessions table and transactions. Add any other tables if
you see fit for the task.
*/

import bcrypt from 'bcrypt';
import { QueryError, Connection, Field } from 'mysql2';
import { User } from '../interfaces/db-interfaces';

/**
 * Creates DATABASE if one does not exist.
 * @param {string} db_name Name of the database.
 * @param {object} db Database connection.
 */
export function createDatabase(db_name: string | undefined, db: Connection): void {
	const sql: string = `CREATE DATABASE IF NOT EXISTS ${db_name}; USE ${db_name}`;
	db.query(sql, (err: QueryError, result: any) => {
		if (err) {
			throw err;
		}
		console.log('Database OK');
	});
};

export function createTables(db: Connection): void {
	const sql: string = `
	CREATE TABLE IF NOT EXISTS users(
		id int AUTO_INCREMENT,
		username VARCHAR(255),
		password VARCHAR(255),
		role VARCHAR(255),
		balance DECIMAL(15, 2),
		user_registered VARCHAR(255),
		PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS transactions(
		id int AUTO_INCREMENT,
		type VARCHAR(255),
		amount DECIMAL(15,2),
		PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS sessions(
		id int AUTO_INCREMENT,
		user_id int,
		time_created VARCHAR(255),
		time_updated VARCHAR(255),
		PRIMARY KEY (id)
	);
	`;
	db.query(sql, (err: QueryError, result: any): void => {
		if (err) {
			throw err;
		}
		console.log('Tables OK');
	});
}

export function addAdminUser (db: Connection): void {
	db.query(`SELECT EXISTS (SELECT 1 FROM users);`, async (err: QueryError, result: any, fields: Field ): Promise<void> => {
		if ( err) {
			throw err;
		}
		if (Object.values(result[0])[0] === 1) {
			console.log('Admin user has not been added since it already exists');
		} else {

			// Generate salt and secure a password via bcrypt.
			const salt: string = await bcrypt.genSalt(8);
			const hashedPassword: string = await bcrypt.hash('admin', salt);

			const user: User = {
				username: 'admin',
				password: hashedPassword,
				role: 'admin',
				balance: 100,
				user_registered: new Date().toLocaleString()
			}
			const sql: string = `INSERT INTO users SET ?`;
			db.query(sql, user, (err, result: any): void => {
				if (err) {
					throw err;
				}
				console.log('Admin user has been added.');
			});
		}
	});
}

export function addCustomerUser (db: Connection): void {
	db.query(`SELECT EXISTS (SELECT 2 FROM users);`, async (err: QueryError, result: any, fields: Field ): Promise<void> => {
		if ( err) {
			throw err;
		}
		if (Object.values(result[0])[0] === 1) {
			console.log('Customer user has not been added since it already exists');
		} else {

			// Generate salt and secure a password via bcrypt.
			const salt: string = await bcrypt.genSalt(8);
			const hashedPassword: string = await bcrypt.hash('john', salt);

			const user: User = {
				username: 'john',
				password: hashedPassword,
				role: 'customer',
				balance: 50,
				user_registered: new Date().toLocaleString()
			}
			const sql: string = `INSERT INTO users SET ?`;
			db.query(sql, user, (err, result: any): void => {
				if (err) {
					throw err;
				}
				console.log('Customer user has been added.');
			});
		}
	});
}

