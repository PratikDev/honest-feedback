import { Exception } from "@/errors/Expection";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { isMoreThanOneHourPassed } from "@/lib/utils";
import UserModel from "@/models/User.model";
import signUpSchema from "@/schemas/signUp.schema";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const data = await request.json();

		// zod validation
		const schemaResponse = signUpSchema.safeParse(data);
		if (!schemaResponse.success) {
			throw new Exception(schemaResponse.error.errors[0].message, 400);
		}

		const { email, password, username } = schemaResponse.data;

		// connect to the database
		await dbConnect();

		const existingUserByUsernameOrEmail = await UserModel.findOne({
			$or: [{ username }, { email }],
		});

		// generate verification code, hash password and verification expiry time,
		// so that we can reuse it for both new and existing users
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationCodeExpiry = new Date();
		verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 1);

		// if user already exists
		if (existingUserByUsernameOrEmail) {
			// if user is already verified
			if (existingUserByUsernameOrEmail.isVerified) {
				throw new Exception("Username or Email already in use", 400);
			}

			const isUsernameMatch =
				existingUserByUsernameOrEmail.username === username;

			// if verification is in process (1hr window)
			const isMoreThanOneHour = isMoreThanOneHourPassed(
				existingUserByUsernameOrEmail.verifyCodeExpiry
			);
			if (!isMoreThanOneHour) {
				const errorMessage = isUsernameMatch
					? "Username already in use"
					: "Verification code already being sent to this email";
				throw new Exception(errorMessage, 400);
			}

			// if verification code expired
			isUsernameMatch
				? (existingUserByUsernameOrEmail.email = email)
				: (existingUserByUsernameOrEmail.username = username); // if username match, update email, else update username
			existingUserByUsernameOrEmail.password = hashedPassword;
			existingUserByUsernameOrEmail.verifyCode = verifyCode;
			existingUserByUsernameOrEmail.verifyCodeExpiry = verificationCodeExpiry;
			existingUserByUsernameOrEmail.createdAt = new Date();

			await existingUserByUsernameOrEmail.save();
		} else {
			const user = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: verificationCodeExpiry,
				messages: [],
			});

			await user.save();
		}

		// send verification email
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);
		if (!emailResponse.success) {
			throw new Exception(emailResponse.message, 500);
		}

		return NextResponse.json({
			success: true,
			message: "User registered successfully. Please verify your email",
		});
	} catch (error) {
		let message = "Error registering user";
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
