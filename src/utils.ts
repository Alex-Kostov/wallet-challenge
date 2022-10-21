import { IncomingMessage } from 'http';

/**
 * Returns the request body parsed as JSON.
 * @param req The request object
 * @returns The functions returns Promise with the body of the passed request parsed to JSON.
 */
export const getPostData = (req: IncomingMessage): Promise<{ [key: string]: any }> => {
	return new Promise((resolve, reject) => {
		try {
			let body: string = ''

			req.on('data', (chunk) => {
				body += chunk.toString()
			})

			req.on('end', () => {
				resolve(JSON.parse(body));
			})
		} catch (error) {
			reject(error)
		}
	})
};

/**
 * Compares passed date string to current time and returns the difference.
 * @param {string} lastUpdatedTime represent the last_updated field form the database.
 * @returns difference between current time and passed time.
 */
export const getTimestampsDiff = (lastUpdatedTime: string) => {
	const currentTime: number = new Date().getTime();
	const timeUpdated: number = new Date(lastUpdatedTime).getTime();
	let diff: number = (timeUpdated - currentTime) / 1000;
	diff /= (60 * 60);
	return diff.toFixed(2);
}

// Help information for the /help endpoint.
export const help = {
	info: 'The REST API endpoints are as follows:',
	"/auth/login": 'A POST request where "username" and "password" must be provided',
	"/auth/logout": 'A POST no parameters are passed, it logout the user and remove the user session.',
	"/users/balance": 'A GET request which does not need any parameters, it will fetch the balance of the current logged in user if he has permissions to access it. Currently both admin and customer can view their balance.',
	"/wallet/list": 'A GET request which fetch the last 10 transactions. If there are less than 10 transactions it fetches all of them. Currently only admin has access to this since this endpoint.',
	"/wallet/list/{x}": 'A GET request which fetch the last X transactions. If there are less than X transactions it fetches all of them. Currently only admin has access to this since this endpoint.',
	"/wallet/deposit": 'A POST request which expects to receive positive "amount" passed. Currently only admin has access to this since this endpoint.',
	"/wallet/withdraw": 'A POST request which expects to receive positive "amount" passed. Currently only admin has access to this since this endpoint.'
}