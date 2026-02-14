"use client";

import { DataTable } from "@/components/custom/app-table";
import { reportColumns } from "./report.columns";

export type ReportType = {
  date: string;
  punchIn?: {
    location: string;
    time: string;
  };
  punchOut?: {
    location: string;
    time: string;
  };
  workingHours: string;
  overtimeHours: string;
  leaveStatus: string;
  lateInReason?: string;
  earlyOutReason?: string;
};

export function ReportTable({
  reports,
}: {
  reports: ReportType[];
}) {
  return (
    <DataTable
      columns={reportColumns}
      data={reports}
      search
      searchText="Search Columns"
      pagination
      pageSize={10}
      sortingEnabled
    />
  );
}
