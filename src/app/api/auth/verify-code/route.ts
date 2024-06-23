import { Exception } from "@/errors/Expection";
import dbConnect from "@/lib/dbConnect";
import { isMoreThanOneHourPassed } from "@/lib/utils";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const { verifyCode, identifier } = await request.json();
		if (!verifyCode || !identifier) {
			throw new Exception("Code is required", 400);
		}

		// connect to the database
		await dbConnect();

		// check if code is valid
		const user = await UserModel.findOne({
			$or: [{ email: identifier }, { username: identifier }],
			verifyCode,
		});

		// if user not found
		if (!user) {
			throw new Exception("Invalid code", 400);
		}

		// if user is already verified
		if (user.isVerified) {
			throw new Exception("User is already verified", 400);
		}

		// if otp is expired
		const isMoreThanOneHour = isMoreThanOneHourPassed(user.verifyCodeExpiry);
		if (isMoreThanOneHour) {
			throw new Exception(
				"Verification code expired. Please sign up again to get a new one",
				400
			);
		}

		// update user to verified
		user.isVerified = true;
		await user.save();

		return NextResponse.json({
			success: true,
			message: "Verification successful",
		});
	} catch (error) {
		let message = "Error verifying code";
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
