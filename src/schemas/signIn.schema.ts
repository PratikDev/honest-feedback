import { z } from "zod";

const signInSchema = z.object({
	identifier: z.string().trim(),
	password: z.string(),
});

export default signInSchema;
