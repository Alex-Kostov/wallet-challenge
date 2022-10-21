import { db } from '../config/db-config';
import { Capabilities } from '../interfaces/auth-interfaces';

/**
 * Returns the role id of user by user id.
 * @param userID ID of the user
 * @returns role id
 */
const getRoleID = (userID: number): Promise<{ role_id: number }[]> => {
	return new Promise((resolve, reject) => {
		db.query('SELECT role_id FROM users where id=?', userID, (err, result: [], fields) => {
			if (err) {
				reject(err);
			}
			if (result.length !== 0) {
				resolve(result);
			}
		});
	});
}

/**
 * Expects role id and returns the capabilities for role.
 * @param roleID id of the role we want to get capabilities for.
 * @returns return object with the capabilities
 */
const getRoleCapabilities = (roleID: number): Promise<{ id: number, role_name: string, read_capability: number, write_capability: number }[]> => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM roles WHERE id=?', roleID, (err, result: [], fields) => {
			if (err) {
				reject(err);
			}
			if (result.length !== 0) {
				resolve(result);
			}
		});
	});
}

/**
 * List the capabilities of a passed user.
 * @param userID id of the user we want to get capabilities for.
 * @returns array with capabilities for the passed in user.
 */
export const listUserPermissions = async (userID: number): Promise<Capabilities> => {
	try {
		const roleIdArr = await getRoleID(userID);
		const capabilities = await getRoleCapabilities(roleIdArr[0].role_id);
		const capsObj: Capabilities = {
			readCap: capabilities[0].read_capability === 1 ? true : false,
			writeCap: capabilities[0].write_capability === 1 ? true : false
		}
		return capsObj;
	} catch (err) {
		throw err;
	}
};





