export interface User {
	username: string,
	password: string,
	role_id: number,
	role: string,
	balance: number,
	user_registered: string,
}

export interface Role {
	role_name: string,
	read_capability: number,
	write_capability: number
}