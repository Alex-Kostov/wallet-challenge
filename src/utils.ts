import { IncomingMessage } from 'http';

export const getPostData = (req: IncomingMessage) => {
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