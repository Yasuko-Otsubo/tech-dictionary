import { z } from "zod";

export const termSchema = z.object({
  itemName: z.string().min(1, "用語名を入力してください"),
  itemContent: z.string().optional(),
  referenceUrls: z.array(z.object({ value: z.url("正しいURLを入力してください") })).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TermFormValues = z.infer<typeof termSchema>;