export interface Session {
	id? :number,
	user_id: number,
	time_created: string,
	time_updated: string
}

export interface LogoutResponse {
	valid?: boolean,
	sessionID?: number | null,
	userID?: number | null,
	msg?: string,
	logout? : string
}

export interface Capabilities {
	readCap: boolean,
	writeCap: boolean
}

export interface BalanceResponse {
	msg?: string,
	balance?: number,
}