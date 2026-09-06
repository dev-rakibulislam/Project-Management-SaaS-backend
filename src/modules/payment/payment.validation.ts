import z from "zod";

export const createPaymentSchema = z.object({
	organizationId: z.string(),
});

export const getSinglePaymentSchema = z.object({
	organizationId: z.string(),
});

// export type getSinglePaymentPayload = z.infer<typeof getSinglePaymentSchema>;
export type CreatePaymentPayload = z.infer<typeof createPaymentSchema>;
