import { z } from "zod";

const acceptMessagesSchema = z.object({
	acceptMessages: z.boolean(),
});
type AcceptMessagesSchemaType = z.infer<typeof acceptMessagesSchema>;

export default acceptMessagesSchema;
export type { AcceptMessagesSchemaType };
