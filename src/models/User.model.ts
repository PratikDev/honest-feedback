import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	verifyCode: string;
	isVerified: boolean;
	verifyCodeExpiry: Date;
	isAcceptingMessages: boolean;
	messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		match: [
			/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
			"Please fill a valid email address",
		],
	},
	password: { type: String, required: [true, "Password is required"] },
	createdAt: { type: Date, default: Date.now },
	verifyCode: {
		type: String,
		required: [true, "Verification code is required"],
	},
	isVerified: { type: Boolean, default: false },
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verification code expiry date is required"],
	},
	isAcceptingMessages: { type: Boolean, default: true },
	messages: [MessageSchema],
});

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);

export default UserModel;
