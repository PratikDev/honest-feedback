export class Exception extends Error {
	code: number;
	constructor(message: string, code: number = 0) {
		super(message);
		this.message = message;
		this.code = code;
	}
}
