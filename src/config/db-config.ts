import mysql from 'mysql2';
import { createDatabase, createTables, addAdminUser, addCustomerUser } from './db-utils';
import * as dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	multipleStatements: true
});

try {
	createDatabase(process.env.DB_DATABASE, db);
	createTables(db);
	addAdminUser(db);
	addCustomerUser(db);
} catch (err) {
	throw (err);
}

console.log('MySQL Connected...');
