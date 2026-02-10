import Image from "next/image";
import { SidebarHeader } from "../ui/sidebar";

export default function CustomSideBarHeader() {
  return (
    <SidebarHeader className="flex flex-col gap-2 border-b">
      <div className="flex gap-2">
        <Image
          src="/humilogo.png"
          width={200}
          height={100}
          alt="Bhumi"
          className="object-center object-contain"
        />
        {/* <p className="text-wrap text-primary font-black text-lg leading-6">
          BHUMI 
        </p> */}
      </div>
      <div className="flex flex-col">
        <p className="italic text-primary">Employee Tracking</p>
      </div>
    </SidebarHeader>
  );
}
