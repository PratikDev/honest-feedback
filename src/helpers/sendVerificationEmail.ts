import VerificationEmail from "@/components/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		const { error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "HonestFeedback - Verify your email address",
			react: VerificationEmail({ username, otp: verifyCode }),
		});

		if (error) {
			console.error("Error sending verification email: ", error);
			return {
				success: false,
				message: error.message,
			};
		}

		return {
			success: true,
			message: "Verification email sent",
		};
	} catch (error) {
		console.error("Error sending verification email: ", error);
		return {
			success: false,
			message: "Error sending verification email",
		};
	}
}
