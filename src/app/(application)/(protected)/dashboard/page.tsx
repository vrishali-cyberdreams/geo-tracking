import { getAllEmployees } from "@/actions/employee.actions";
import { EmployeeTable } from "@/components/employee/table/employee.table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const response = await getAllEmployees(session?.user.id ?? "");

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 px-4 py-6 bg-card rounded-lg border">
        <h1 className="text-xl text-primary font-bold">Employee Management</h1>
        <EmployeeTable employees={response.data ?? []} />
      </div>
    </div>
  )
}
