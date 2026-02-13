import { LeaveStatus, PunchType } from "@prisma/client";
import z from "zod";

export const attendanceSchema = z.object({
  email: z.email("Invalid Email"),
  punchType: z.enum(PunchType).optional(),
  lateInReason: z.string().optional(),
  earlyOutReason: z.string().optional(),
  leaveStatus: z.enum(LeaveStatus),
})
  .superRefine((data, ctx) => {
    // ✅ Rule 1: punchType required unless FULL leave
    if (data.leaveStatus !== "FULL" && !data.punchType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Punch Type is required",
        path: ["punchType"], // attaches error to field
      });
    }

    // ✅ Optional: Clean validation logic for FULL leave
    if (data.leaveStatus === "FULL") {
      // If FULL leave, these should not be sent
      if (data.punchType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Punching is not allowed on full leave",
          path: ["punchType"],
        });
      }
    }
  });

export type TAttendance = Omit<z.infer<typeof attendanceSchema>, "email" | "punchType">;