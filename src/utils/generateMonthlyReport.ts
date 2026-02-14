import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { Punch } from "@prisma/client";

export const formatMinutes = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} hrs ${m} mins`;
};

export const getMonthlyTableData = (
  attendance: AttendanceWithRelations[],
  selectedDate: Date
) => {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  return attendance
    .filter((att) => {
      const d = new Date(att.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .map((att) => {
      const punchIn = att.punch.find((p: Punch) => p.type === "IN");
      const punchOut = att.punch.find((p: Punch) => p.type === "OUT");

      return {
        date: new Date(att.createdAt).toLocaleDateString("en-GB"),

        punchIn: punchIn
          ? {
            location: punchIn.displayName,
            time: new Date(punchIn.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          }
          : undefined,

        punchOut: punchOut
          ? {
            location: punchOut.displayName,
            time: new Date(punchOut.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          }
          : undefined,

        workingHours: formatMinutes(att.totalWorkMinutes),
        overtimeHours: formatMinutes(att.overtimeMinutes),

        leaveStatus:
          att.leaveStatus === "NONE"
            ? "Present"
            : att.leaveStatus,

        lateInReason: att.lateInReason ?? undefined,
        earlyOutReason: att.earlyOutReason ?? undefined,
      };
    });
};
