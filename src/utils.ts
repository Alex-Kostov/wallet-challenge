import { IncomingMessage } from 'http';

/**
 * Returns the request body parsed as JSON.
 * @param req The request object
 * @returns The functions returns Promise with the body of the passed request parsed to JSON.
 */
export const getPostData = (req: IncomingMessage): Promise< { [key: string]: any} > => {
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