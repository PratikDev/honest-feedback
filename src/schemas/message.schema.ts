import { z } from "zod";

export const messageSchema = z.object({
	content: z
		.string()
		.trim()
		.min(5, "Message must be at least 5 characters long")
		.max(500, "Message must be at most 500 characters long"),
});
