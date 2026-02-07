import { auth } from "@/lib/auth";
import { TRoleLiteral } from "@/lib/rbac";
import { roleHierarchyManager } from "@/lib/rbac/hierarchy";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userInfo = roleHierarchyManager.getRoleInfo(session?.user.role as TRoleLiteral);
  if (!session || !session.user || (userInfo && userInfo.level < 80)) {
    redirect("/user");
  }

  redirect('/dashboard');
}
