import { applicationSidebarConfig } from "./sidbar.config";
import { roleHierarchyManager } from "@/lib/rbac/hierarchy";
import { SidebarConfig } from "../sidebar.types";
import CustomSidebar from "../sidebar";
import { TRoleLiteral } from "@/lib/rbac";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRolesStr = session?.user.role;
  const userRoles = userRolesStr?.split(",");

  const appSidebarConfig = Object.keys(applicationSidebarConfig).reduce(
    (acc, group) => {
      const accessiblePages = applicationSidebarConfig[group]?.filter((item) =>
        userRoles?.some(
          (role) =>
            roleHierarchyManager.doesOverride(
              role as TRoleLiteral,
              item.minimumAccessRole,
            ) || role === item.minimumAccessRole,
        ),
      );

      if (accessiblePages && accessiblePages.length > 0) {
        acc[group] = accessiblePages;
      }
      return acc;
    },
    {} as SidebarConfig,
  );
  return (
    <CustomSidebar
      sidebarConfig={appSidebarConfig}
      user={{ name: session?.user.name ?? "", role: userRolesStr ?? "" }}
    />
  );
}
