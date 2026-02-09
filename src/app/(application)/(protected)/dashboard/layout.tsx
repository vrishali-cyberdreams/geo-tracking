import AppSidebar from "@/components/sidbar/appSidebar/appSidebar";
import { CustomTrigger } from "@/components/sidbar/customSidebarTrigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
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
