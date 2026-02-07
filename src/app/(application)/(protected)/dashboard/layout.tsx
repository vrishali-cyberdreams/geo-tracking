import AppSidebar from "@/components/sidbar/appSidebar/appSidebar";
import { CustomTrigger } from "@/components/sidbar/customSidebarTrigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { TRoleLiteral } from "@/lib/rbac";
import { roleHierarchyManager } from "@/lib/rbac/hierarchy";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userInfo = roleHierarchyManager.getRoleInfo(session.user.role as TRoleLiteral);
  if(userInfo && userInfo.level < 80){
    redirect("/user");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-baseline justify-between p-4 py-4">
            <div className="flex gap-x-4 items-center justify-center">
              <CustomTrigger />
            </div>
          </div>
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}
