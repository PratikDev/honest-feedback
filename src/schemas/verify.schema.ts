import { z } from "zod";

const verifySchema = z.object({
	verifyCode: z
		.string()
		.trim()
		.length(6, "Code must be exactly 6 characters long"),
});
type verifySchemaType = z.infer<typeof verifySchema>;

export default verifySchema;
export type { verifySchemaType };
