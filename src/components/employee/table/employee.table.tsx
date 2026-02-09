"use client";

import { DataTable } from "@/components/custom/app-table";
import { Employee } from "@prisma/client";
import { employeeColumns } from "./employee.columns";

export function EmployeeTable({
  employees,
}: {
  employees: Employee[];
}) {
  return (
    <DataTable
      columns={employeeColumns}
      data={employees}
      search
      searchText="Search Employee"
      pagination
      pageSize={10}
      sortingEnabled
    />
  );
}
