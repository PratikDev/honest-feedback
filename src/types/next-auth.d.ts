import { User as UserDocument } from "@/models/User.model";
import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
	interface User extends UserDocument {
		_id: string;
	}
	interface Session {
		user: { _id: string } & UserDocument & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends UserDocument {
		_id: string;
	}
}
