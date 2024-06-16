import authOptions from "@/app/api/auth/[...nextauth]/options";
import { Exception } from "@/errors/Expection";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	await dbConnect();

	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) {
			throw new Exception("Unauthorized", 401);
		}

		const userId = user._id;
		const { acceptMessages } = await request.json();

		// update user to accept messages
		const updatedUser = await UserModel.findByIdAndUpdate(userId, {
			isAcceptingMessages: acceptMessages,
		});
		if (!updatedUser) {
			throw new Exception("User not found", 404);
		}

		return NextResponse.json({
			success: true,
			message: "User updated successfully",
		});
	} catch (error) {
		let message = "Error updating the accept messages status";
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

export async function GET(): Promise<NextResponse<ApiResponse>> {
	await dbConnect();

	try {
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!user) {
			throw new Exception("Unauthorized", 401);
		}

		const userId = user._id;
		const foundUser = await UserModel.findById(userId);
		if (!foundUser) {
			throw new Exception("User not found", 404);
		}

		return NextResponse.json({
			success: true,
			message: "User found",
			isAcceptingMessages: foundUser.isAcceptingMessages,
		});
	} catch (error) {
		let message = "Error getting the accept messages status";
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
