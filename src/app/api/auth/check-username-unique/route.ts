import { Exception } from "@/errors/Expection";
import dbConnect from "@/lib/dbConnect";
import { isMoreThanOneHourPassed } from "@/lib/utils";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signUp.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const { searchParams } = new URL(request.url);
		const data = {
			username: searchParams.get("username"),
		};

		// zod validation
		const schemaResponse = UsernameQuerySchema.safeParse(data);
		if (!schemaResponse.success) {
			throw new Exception(schemaResponse.error.errors[0].message, 400);
		}

		const { username } = schemaResponse.data;

		// connect to the database
		await dbConnect();

		const existingUserByUsername = await UserModel.findOne({
			username,
		});

		// if user not found
		if (!existingUserByUsername) {
			return NextResponse.json({
				success: true,
				message: "Username is unique",
			});
		}

		// if user is already verified
		if (existingUserByUsername.isVerified) {
			throw new Exception("Username already in use", 400);
		}

		// if verification is in process (1hr window)
		const isMoreThanOneHour = isMoreThanOneHourPassed(
			existingUserByUsername.verifyCodeExpiry
		);
		if (!isMoreThanOneHour) {
			throw new Exception("Username already in use", 400);
		}

		// if user is not verified and verification code have expired
		return NextResponse.json({
			success: true,
			message: "Username is unique",
		});
	} catch (error) {
		let message = "Error while checking the username";
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
