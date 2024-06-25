import authOptions from "@/app/api/auth/[...nextauth]/options";
import { Exception } from "@/errors/Expection";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User.model";
import messageSchema from "@/schemas/message.schema";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ApiResponse>> {
	try {
		// connect to the database
		await dbConnect();

		const session = await getServerSession(authOptions);
		const userSession = session?.user;
		if (!userSession) {
			throw new Exception("Unauthorized", 401);
		}

		const userId = new mongoose.Types.ObjectId(userSession._id);

		// get messages for the user by aggregating the messages collection
		const user = await UserModel.aggregate([
			{
				$match: {
					_id: userId,
				},
			},
			{
				$unwind: "$messages",
			},
			{
				$sort: {
					"messages.createdAt": -1,
				},
			},
			{
				$group: {
					_id: "$_id",
					messages: {
						$push: "$messages",
					},
				},
			},
		]);

		return NextResponse.json({
			success: true,
			messages: user.length ? user[0].messages : [],
			message: "Messages retrieved successfully",
		});
	} catch (error) {
		let message = "Error getting the messages";
		let status = 500;

		// if error is an instance of Exception, we can get the error message and status code
		if (error instanceof Exception) {
			message = error.message;
			status = error.code;
		} else {
			console.error(message, error);
		}

		return NextResponse.json({ success: false, message }, { status });
	}
}

export async function POST(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const data = await request.json();

		// zod validation
		const schemaResponse = messageSchema.safeParse(data);
		if (!schemaResponse.success) {
			throw new Exception(schemaResponse.error.errors[0].message, 400);
		}

		const { content, identifier } = schemaResponse.data;

		// connect to the database
		await dbConnect();

		// set the message to the identifier (username/email)
		const user = await UserModel.findOne({
			$or: [{ username: identifier }, { email: identifier }],
		});

		// if user is not found or user isn't verified
		if (!user || !user.isVerified) {
			throw new Exception("User not found", 404);
		}

		// if user is not accepting messages
		if (!user.isAcceptingMessages) {
			throw new Exception("User is not accepting messages", 403);
		}

		const newMessage = {
			content,
		};

		// add the message to the user's messages array
		user.messages.push(newMessage as Message);
		await user.save();

		return NextResponse.json({
			success: true,
			message: "Message sent successfully",
		});
	} catch (error) {
		let message = "Error sending the message";
		let status = 500;

		// if error is an instance of Exception, we can get the error message and status code
		if (error instanceof Exception) {
			message = error.message;
			status = error.code;
		} else {
			console.error(message, error);
		}

		return NextResponse.json({ success: false, message }, { status });
	}
}

export async function DELETE(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const { messageId } = await request.json();
		if (!mongoose.isValidObjectId(messageId)) {
			throw new Exception("Invalid request", 400);
		}

		// connect to the database
		await dbConnect();

		const session = await getServerSession(authOptions);
		const userSession = session?.user;
		if (!userSession) {
			throw new Exception("Unauthorized", 401);
		}

		// delete the message from the user's messages array
		const user = await UserModel.updateOne(
			{
				_id: userSession._id,
			},
			{
				$pull: {
					messages: {
						_id: messageId,
					},
				},
			}
		);

		if (user.modifiedCount === 0) {
			throw new Exception("Message not found or already deleted", 404);
		}

		return NextResponse.json({
			success: true,
			message: "Message deleted successfully",
		});
	} catch (error) {
		let message = "Error deleting the message";
		let status = 500;

		// if error is an instance of Exception, we can get the error message and status code
		if (error instanceof Exception) {
			message = error.message;
			status = error.code;
		} else {
			console.error(message, error);
		}

		return NextResponse.json({ success: false, message }, { status });
	}
}
