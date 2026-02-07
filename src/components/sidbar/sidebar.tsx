import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CustomSideBarHeader from "./sidebarHeader";
import { SidebarConfig } from "./sidebar.types";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CustomSidebarFooter from "./sidebarFooter";
import { ReactNode } from "react";
import MenuButton from "./appSidebar/menuButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

export default function CustomSidebar({
  sidebarConfig: appSidebarConfig,
  user,
}: {
  sidebarConfig: SidebarConfig;
  user: { name: string; role: string };
}) {
  return (
    <Sidebar variant="sidebar">
      <CustomSideBarHeader />
      <SidebarContent>
        {Object.keys(appSidebarConfig).map((group) => {
          if (appSidebarConfig[group]?.length == 1)
            return (
              <SidebarGroup key={group}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <MenuButton>
                      <Link
                        href={appSidebarConfig[group][0]?.href ?? "/not-found"}
                      >
                        {appSidebarConfig[group][0]?.icon as ReactNode}
                        {appSidebarConfig[group][0]?.title}
                      </Link>
                    </MenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            );
          else
            return (
              <Collapsible
                key={group}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup className="">
                  <SidebarGroupLabel
                    className="text-sm text-primary font-semibold"
                    asChild
                  >
                    <CollapsibleTrigger>
                      {group}
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent className="mt-2">
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {appSidebarConfig[group]?.map((item) => (
                          <SidebarMenuItem key={item.href}>
                            <MenuButton>
                              <Link href={item.href}>
                                {item.icon as ReactNode}
                                {item.title}
                              </Link>
                            </MenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
        })}
      </SidebarContent>
      <CustomSidebarFooter user={user} />
    </Sidebar>
  );
}
