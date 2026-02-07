import { TRoleLiteral } from "@/lib/rbac";
import { ReactNode } from "react";

export type SidebarConfig = Record<string, Array<SidebarPageMenuItem>>;

export interface SidebarPageMenuItem {
  title: string;
  href: string;
  icon?: ReactNode;
  minimumAccessRole: TRoleLiteral;
}
