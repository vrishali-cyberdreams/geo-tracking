import { getAllUsers } from "@/actions/user.actions";
import { UsersTable } from "@/components/user/table/users.table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const response = await getAllUsers(session?.user.id ?? "");

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 px-4 py-6 bg-card rounded-lg border">
        <h1 className="text-xl text-primary font-bold">User Management</h1>
        <UsersTable users={response.data ?? []} />
      </div>
    </div>
  )
}
