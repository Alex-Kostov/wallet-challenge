import bcrypt from 'bcrypt';
import { QueryError, Connection, Field } from 'mysql2';
import { User, Role } from '../interfaces/db-interfaces';

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
		console.log('Database ready');
	});
}


/**
 * Created the need Tables if they do not exists.
 * @param db Database connection.
 */
export function createTables(db: Connection): void {
	const sql: string = `
	CREATE TABLE IF NOT EXISTS users(
		id INT AUTO_INCREMENT,
		username VARCHAR(255),
		password VARCHAR(255),
		role_id INT,
		role VARCHAR(255),
		balance DECIMAL(15, 2),
		user_registered VARCHAR(255),
		PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS roles(
		id INT AUTO_INCREMENT,
		role_name VARCHAR(255),
		read_capability INT,
		write_capability INT,
		PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS transactions(
		id INT AUTO_INCREMENT,
		type VARCHAR(255),
		amount DECIMAL(15,2),
		PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS sessions(
		id INT AUTO_INCREMENT,
		user_id INT,
		time_created VARCHAR(255),
		time_updated VARCHAR(255),
		PRIMARY KEY (id)
	);
	`;
	db.query(sql, (err: QueryError, result: any): void => {
		if (err) {
			throw err;
		}
		console.log('Tables Ready');
	});
}

/**
 * Ads Admin and Customer user roles if they do not exists.
 * Admin role can access all the endpoints
 * Customer role can only check their balance
 * @param db Database connection.
 */
export function createRoles(db: Connection): void {
	db.query('SELECT EXISTS (SELECT 1 FROM roles);', (err: QueryError, result: any, fields: Field): void => {
		if (err) {
			throw err;
		}
		if (Object.values(result[0])[0] === 1) {
			// Roles are already created.
			console.log('User Roles were not added since they already exists')
		} else {
			// Create new Roles.

			/**
			 * Admin role will have the following permissions:
			 * balance - check balance
			 * list - list the last X transactions
			 * deposit - add money to their account
			 * withdraw - withdraw money from their account
			 */
			const adminRole: Role = {
				role_name: 'admin',
				read_capability: 1,
				write_capability: 1
			}

			/**
			 * Customer Role will have the following permissions:
			 * balance - check their balance
			 * customer WILL NOT BE able to add or withdraw funds from their account.
			 */
			const customerRole: Role = {
				role_name: 'customer',
				read_capability: 1,
				write_capability: 0
			}

			// Insert the 2 new roles into the database.
			db.query(
				'INSERT INTO roles (role_name, read_capability, write_capability) VALUES ?',
				[[adminRole, customerRole].map(item => [item.role_name, item.read_capability, item.write_capability])],
				(err, result, fields) => {
					if (err) {
						throw err;
					}
					console.log('Admin and Customer user roles have been added.');
				});
		}
	});
}

/**
 * Ads test admin user if ones does not exist.
 * The username and password are both admin even though pass is hashed.
 * @param db Database Connection.
 */
export function addAdminUser(db: Connection): void {
	db.query(`SELECT EXISTS (SELECT 1 FROM users);`, async (err: QueryError, result: any, fields: Field): Promise<void> => {
		if (err) {
			throw err;
		}
		if (Object.values(result[0])[0] === 1) {
			// Admin user already exists.
			console.log('Admin user has not been added since it already exists');
		} else {
			// Admin user is not present we need to create one.
			// Generate salt and secure a password via bcrypt.
			const salt: string = await bcrypt.genSalt(8);
			const hashedPassword: string = await bcrypt.hash('admin', salt);

			const user: User = {
				username: 'admin',
				password: hashedPassword,
				role_id: 1,
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

/**
 * Ads test Customer user if ones does not exist.
 * The username and password are both john even though pass is hashed.
 * @param db Database Connection.
 */
export function addCustomerUser(db: Connection): void {
	db.query(`SELECT EXISTS (SELECT 2 FROM users);`, async (err: QueryError, result: any, fields: Field): Promise<void> => {
		if (err) {
			throw err;
		}
		if (Object.values(result[0])[0] === 1) {
			// Customer user already exists.
			console.log('Customer user has not been added since it already exists');
		} else {
			// Customer user is not present we need to create one.
			// Generate salt and secure a password via bcrypt.
			const salt: string = await bcrypt.genSalt(8);
			const hashedPassword: string = await bcrypt.hash('john', salt);

			const user: User = {
				username: 'john',
				password: hashedPassword,
				role_id: 2,
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

