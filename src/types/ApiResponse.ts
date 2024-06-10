import { Message } from "@/models/User.model";

export type ApiResponse = {
	success: boolean;
	message: string;
	isAcceptingMessages?: boolean;
	messages?: Message[];
};
