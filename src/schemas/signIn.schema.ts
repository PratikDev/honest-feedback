import { z } from "zod";

const signInSchema = z.object({
	identifier: z.string().trim(),
	password: z.string(),
});
type signInSchemaType = z.infer<typeof signInSchema>;

export default signInSchema;
export type { signInSchemaType };
