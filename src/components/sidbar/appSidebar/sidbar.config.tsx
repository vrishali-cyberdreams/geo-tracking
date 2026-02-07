import { SidebarConfig } from "../sidebar.types";
import {
  User,
} from "lucide-react";

export const applicationSidebarConfig: SidebarConfig = {
  UserManagement: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <User />,
      minimumAccessRole: "admin",
    },
  ],
};
