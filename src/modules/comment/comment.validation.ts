import { z } from "zod";

export const createCommentValidation = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(2000, "Comment cannot exceed 2000 characters"),
});

export type CreateCommentInput = z.infer<
  typeof createCommentValidation
>;