import { z } from "zod";

const acceptMessagesSchema = z.object({
	acceptMessages: z.boolean(),
});

export default acceptMessagesSchema;
