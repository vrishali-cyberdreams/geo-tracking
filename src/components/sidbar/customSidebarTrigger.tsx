"use client";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="cursor-pointer">
      {open ? (
        <PanelLeftClose size={22} strokeWidth={2} />
      ) : (
        <PanelLeftOpen size={22} strokeWidth={2} />
      )}
    </button>
  );
}
