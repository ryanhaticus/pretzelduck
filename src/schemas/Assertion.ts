import { z } from 'zod';

export const Assertion = z.object({
	completed: z.boolean(),
});
