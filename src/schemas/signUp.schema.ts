import { z } from "zod";

const usernameValidation = z
	.string()
	.trim()
	.min(2, "Username must be at least 2 characters long")
	.max(300, "Username must be at most 300 characters long")
	.regex(
		/^[a-zA-Z0-9_]+$/,
		"Username must only contain letters, numbers, and underscores"
	);

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});
