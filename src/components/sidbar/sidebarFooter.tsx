"use client";

import { ChevronRight, LogOut } from "lucide-react";
import { roleHierarchyManager } from "@/lib/rbac/hierarchy";
import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function CustomSidebarFooter({
  user,
}: {
  user: { name: string; role: string };
}) {
  const userInintials = user.name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  // console.log(user);
  const highestUserRole = roleHierarchyManager.getHighestRole(user.role);

  const router = useRouter();

  const handleLogout = useCallback(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  }, [router]);

  const { isMobile } = useSidebar();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="flex gap-3 p-2 bg-sidebar w-full h-full hover:bg-sidebar-accent hover:text-primary"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/30">
                    {userInintials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left h-full flex-1">
                  <h1 className="font-bold">{user.name}</h1>
                  <h2 className="font-light text-sm italic text-sidebar-accent-foreground">
                    {highestUserRole}
                  </h2>
                </div>
                <ChevronRight className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? 'top' : 'right'}
              align="end"
              className="w-[--radix-popper-anchor-width] bg-sidebar border-accent/30"
            >
              {/* <DropdownMenuItem className="group bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent">
                <Button
                  className="flex gap-2 w-full p-0 has-[>svg]:px-1 items-center justify-start h-fit"
                  variant={"ghost"}
                  onClick={()=>router.push('/user/my-account')}
                >
                  <User className="text-sidebar-foreground group-hover:text-sidebar-primary" />
                  Account
                </Button>
              </DropdownMenuItem> */}
              <DropdownMenuItem className="group bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent">
                <Button
                  className="flex gap-2 w-full p-0 has-[>svg]:px-1 items-center justify-start h-fit"
                  variant={"ghost"}
                  onClick={handleLogout}
                >
                  <LogOut />
                  Sign out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
