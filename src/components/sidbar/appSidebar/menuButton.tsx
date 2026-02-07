"use client";

import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function MenuButton({ children }: { children: ReactNode; }) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuButton
      className="sidebar-menu-item font-bold"
      onClick={() => isMobile && setOpenMobile(false)}
      asChild
    >
      {children}
    </SidebarMenuButton>
  );
}
