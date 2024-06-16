import { z } from "zod";

const verifySchema = z.object({
	code: z.string().trim().length(6, "Code must be exactly 6 characters long"),
});

export default verifySchema;
