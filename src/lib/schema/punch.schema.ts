import { PunchType } from "@prisma/client";
import z from "zod";

export const punchSchema = z.object({
  lat: z.number(),
  long: z.number(),
  displayName: z.string(),
  type: z.enum(PunchType).optional()
});

export type TPunch = z.infer<typeof punchSchema>;