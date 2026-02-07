"use client";

import { DataTable } from "@/components/custom/app-table";
import { User } from "@prisma/client";
import { userColumns } from "./users.columns";

export function UsersTable({
  users,
}: {
  users: User[];
}) {
  return (
    <DataTable
      columns={userColumns}
      data={users}
      search
      searchText="Search User"
      pagination
      pageSize={10}
      sortingEnabled
    />
  );
}
