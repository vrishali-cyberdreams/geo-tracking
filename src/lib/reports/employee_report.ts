import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { EmployeeWithRelations } from "@/actions/employee.actions";
import { Punch } from "@prisma/client";
import ExcelJS from "exceljs";

function formatMinutesToHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hrLabel = hours === 1 ? "hr" : "hrs";
  const minLabel = minutes === 1 ? "min" : "mins";

  return `${hours} ${hrLabel} ${minutes} ${minLabel}`;
}

export const generateEmployeeMonthlyReport = async (
  employee: EmployeeWithRelations,
  selectedDate: Date
) => {
  try {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    /* ---------------- Filter Attendance ---------------- */

    const monthlyAttendance = employee.attendance.filter((att: AttendanceWithRelations) => {
      const d = new Date(att.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (!monthlyAttendance.length) {
      alert("No attendance found for selected month");
      return;
    }

    /* ---------------- Create Workbook ---------------- */

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Punch In", key: "punchIn", width: 22 },
      { header: "Punch Out", key: "punchOut", width: 22 },
      { header: "Working Hours", key: "workingHours", width: 18 },
      { header: "Overtime Hours", key: "overtimeHours", width: 18 },
      { header: "Status", key: "status", width: 15 },
    ];

    /* ---------------- Fill Rows ---------------- */

    monthlyAttendance.forEach((att: AttendanceWithRelations) => {
      const punchIn = att.punch.find((p: Punch) => p.type === "IN");
      const punchOut = att.punch.find((p: Punch) => p.type === "OUT");

      sheet.addRow({
        date: new Date(att.createdAt).toLocaleDateString("en-GB"),
        punchIn: punchIn
          ? new Date(punchIn.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // change to false if you want 24-hour format
          })
          : "-",
        punchOut: punchOut
          ? new Date(punchOut.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // change to false if you want 24-hour format
          })
          : "-",
        workingHours: formatMinutesToHoursMinutes(att.totalWorkMinutes),
        overtimeHours: formatMinutesToHoursMinutes(att.overtimeMinutes),
        status:
          att.leaveStatus === "FULL"
            ? "Leave"
            : att.leaveStatus === "HALF"
              ? "Half Leave"
              : "Present",
      });
    });

    sheet.getRow(1).font = { bold: true };

    /* ---------------- Download File ---------------- */

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    const monthName = selectedDate.toLocaleString("default", { month: "long" });

    a.href = url;
    a.download = `${employee.firstName}_${monthName}_${year}_Attendance.xlsx`;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error generating report:", err);
    alert("Failed to generate report");
  }
};
