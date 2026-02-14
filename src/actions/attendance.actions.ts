"use server"

import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { TAttendance } from "@/lib/schema/attendance.schema";
import { TPunch } from "@/lib/schema/punch.schema";
import { Attendance, Punch } from "@prisma/client";

// ATTENDANCE WITH RELATION TYPE
export type AttendanceWithRelations = Attendance & {
  punch: Punch[]
}

// MARK ATTENDANCE
export async function markAttendance({
  punchData,
  attendanceData,
  employeeId,
}: {
  punchData: TPunch;
  attendanceData: TAttendance;
  employeeId: string;
}): Promise<Response> {
  try {
    const result: { status: "error" | "success"; message: string } =
      await prisma.$transaction(async (tx) => {

        // 1. FIND EMPLOYEE WITH GIVEN EMAIL
        const employee = await tx.employee.findFirst({
          where: {
            id: employeeId
          },
          select: {
            id: true
          }
        });

        if (!employee) {
          return {
            status: "error",
            message: "Employee with this email does not exist",
          };
        }

        // 2. CHECK IF ATTENDANCE EXISTS
        const now = new Date();

        // Start of today (00:00:00)
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        // Start of tomorrow (exclusive upper bound)
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const existingAttendance = await tx.attendance.findFirst({
          where: {
            employeeId: employee.id,
            createdAt: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        });

        // 3. IF ATTENDANCE EXISTS
        if (existingAttendance) {
          // 4. CHECK IF FULL LEAVE 
          if (existingAttendance.leaveStatus == 'FULL') {
            return {
              status: "error",
              message: "Cannot punch on full leave",
            };
          }

          // 5. IF EMPLOYEE IS TRYING TO PUNCH IN
          if (punchData.type == 'IN') {
            const punchIn = await tx.punch.findFirst({
              where: {
                attendanceId: existingAttendance.id,
                type: 'IN'
              }
            });

            if (punchIn) {
              return {
                status: "error",
                message: "Already punched In for today",
              };
            } else {
              await tx.punch.create({
                data: {
                  ...punchData,
                  type: 'IN',
                  attendanceId: existingAttendance.id
                }
              });
              return {
                status: "success",
                message: "Attendance marked successfully",
              };
            }
          }

          // 6. IF EMPLOYEE IS TRYING TO PUNCH OUT
          if (punchData.type == 'OUT') {
            const punchIn = await tx.punch.findFirst({
              where: {
                attendanceId: existingAttendance.id,
                type: 'IN'
              }
            });

            if (!punchIn) {
              return {
                status: "error",
                message: "Cannot punch Out before punching IN",
              };
            }

            const punchOut = await tx.punch.findFirst({
              where: {
                attendanceId: existingAttendance.id,
                type: 'OUT'
              }
            });

            if (punchOut) {
              return {
                status: "error",
                message: "Already punched Out for today",
              };
            } else {
              const newPunchut = await tx.punch.create({
                data: {
                  ...punchData,
                  type: 'OUT',
                  attendanceId: existingAttendance.id
                }
              });

              // TIME CALCULATIONS
              const punchInTime = new Date(punchIn.createdAt);
              const punchOutTime = new Date(newPunchut.createdAt);

              // ---- Create today's 6 PM reference ----
              const sixPM = new Date(punchOutTime);
              sixPM.setHours(18, 0, 0, 0); // 6:00 PM

              let totalWorkMinutes = 0;
              let overtimeMinutes = 0;

              // ---- Case 1: Punch out before or at 6 PM ----
              if (punchOutTime <= sixPM) {
                totalWorkMinutes = Math.floor(
                  (punchOutTime.getTime() - punchInTime.getTime()) / (1000 * 60)
                );
                overtimeMinutes = 0;
              }
              // ---- Case 2: Punch out after 6 PM ----
              else {
                // Working minutes till 6 PM
                totalWorkMinutes = Math.floor(
                  (sixPM.getTime() - punchInTime.getTime()) / (1000 * 60)
                );

                // Overtime minutes after 6 PM
                overtimeMinutes = Math.floor(
                  (punchOutTime.getTime() - sixPM.getTime()) / (1000 * 60)
                );
              }

              await tx.attendance.update({
                where: {
                  id: existingAttendance.id
                },
                data: {
                  earlyOutReason: attendanceData.earlyOutReason,
                  overtimeMinutes,
                  totalWorkMinutes
                }
              });
              return {
                status: "success",
                message: "Attendance marked successfully",
              };
            }
          }
        }

        // IF ATTENDANCE DOES NOT EXIST AND EMPLOYEE MARKED PUNCH OUT, SHOW ERROR
        if (punchData.type == 'OUT') {
          return {
            status: "error",
            message: "Cannot punch Out before punching IN",
          };
        }

        // 8. IF EMPLOYEE EXISTS AND ATTENDANCE DOESNT, THEN CREATE ATTENDANCE FOR EMPLOYEE
        const attendance = await tx.attendance.create({
          data: {
            ...attendanceData,
            employeeId: employee.id
          }
        });

        if (!attendance) {
          return {
            status: "error",
            message: "Attendance marking failed",
          };
        }

        // 9. MARK FULL LEAVE IF NO PUNCH
        if (!punchData.type) {
          return {
            status: "success",
            message: "Full Leave marked successfully",
          };
        }

        // 10. IF ATTENDANCE IS MARKED, ATTACH PUNCH TO ATTENDANCE
        const punch = await tx.punch.create({
          data: {
            ...punchData,
            type: punchData.type,
            attendanceId: attendance.id
          }
        });

        if (!punch) {
          return {
            status: "error",
            message: "Attendance marking failed",
          };
        }

        return {
          status: "success",
          message: "Attendance marked successfully",
        };
      });

    if (result.status == 'success') {
      return Response.success(undefined, "Attendance marked successfully");
    }

    return Response.error(result.message);
  } catch (error) {
    console.log(`ATTENDANCE_ACTION/MARK_ATTENDANCE: ${(error as Error).message}`);
    if (process.env.NODE_ENV == "development") {
      return Response.error((error as Error).message);
    }
    return Response.error("An error occurred while marking the attendance");
  }
}

// GET EMPLOYEE TODAY'S ATTENDANCE
export async function getEmployeeAttendance(employeeId: string): Promise<Response<AttendanceWithRelations>> {
  try {
    // CHECK IF ATTENDANCE EXISTS
    const now = new Date();

    // Start of today (00:00:00)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Start of tomorrow (exclusive upper bound)
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        punch: true
      }
    });

    if (!attendance) {
      return Response.error("Attendance not found");
    }

    return Response.success(attendance);
  } catch (error) {
    console.log(`ATTENDANCE_ACTION/GET_EMPLOYEE_ATTENDANCE: ${(error as Error).message}`);
    if (process.env.NODE_ENV == "development") {
      return Response.error((error as Error).message);
    }
    return Response.error("An error occurred while fetching employee attendance");
  }
}
