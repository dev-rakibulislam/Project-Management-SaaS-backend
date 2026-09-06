import z from "zod";

export const createPaymentSchema = z.object({
	organizationId: z.string(),
});

export type CreatePaymentPayload = z.infer<typeof createPaymentSchema>;
