import { z } from "zod";

const statusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  content: z.string().min(50, "Content is too short"),
  category: z.string().min(1, "Category is required"),
  status: statusSchema.optional()
});

export const updateArticleSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(150, "Title is too long").optional(),
    content: z.string().min(50, "Content is too short").optional(),
    category: z.string().min(1, "Category is required").optional(),
    status: statusSchema.optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  });

export const articlesQuerySchema = z.object({
  category: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  page: z.string().optional(),
  size: z.string().optional()
});

export const authorArticlesQuerySchema = z.object({
  includeDeleted: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional()
});
