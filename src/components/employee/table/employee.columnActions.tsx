"use client";

import { EmployeeLocationCalendar } from "../employeeCalendar";

export function EmployeeActions({
  employeeId,
}: {
  employeeId: string;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <EmployeeLocationCalendar employeeId={employeeId} />
    </div>
  );
}
