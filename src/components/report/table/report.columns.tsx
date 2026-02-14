"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ReportType } from "./report.table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const reportColumns: ColumnDef<ReportType>[] =
  [
    {
      id: "date",
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.date}</div>,
    },
    {
      id: "punchIn",
      accessorKey: 'punchIn',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Punch In
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        <div className="px-4">
          {row.original.punchIn ?
            <div className="flex flex-col gap-2 max-w-60 text-wrap items-center">
              <p className="font-semibold">{row.original.punchIn.time}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='sm'
                      variant="outline">
                      View Location
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
                    {row.original.punchIn.location}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            : '-'}
        </div>,
    },
    {
      id: "punchOut",
      accessorKey: 'punchOut',
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Punch Out
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        <div className="px-4">
          {row.original.punchOut ?
            <div className="flex flex-col gap-2 max-w-60 text-wrap items-center">
              <p className="font-semibold">{row.original.punchOut.time}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='sm'
                      variant="outline">
                      View Location
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
                    {row.original.punchOut.location}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            : '-'}
        </div>,
    },
    {
      id: "workingHours",
      accessorKey: "workingHours",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Working Hours
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.workingHours}</div>,
    },
    {
      id: "overtimeHours",
      accessorKey: "overtimeHours",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Overtime Hours
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.overtimeHours}</div>,
    },
    {
      id: "status",
      accessorKey: "leaveStatus",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Leave Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.leaveStatus}</div>,
    },
    {
      id: "reasons",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reasons
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        <div className="flex flex-col gap-2 max-w-40 text-wrap">
          {row.original.lateInReason ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='sm'
                    variant="outline">
                    Late Punch In
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
                  {row.original.lateInReason}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> : <div className="text-center">On Time</div>}

          {row.original.earlyOutReason ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='sm'
                    variant="outline">
                    Early Punch Out
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
                  {row.original.earlyOutReason}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> : <div className="text-center">On Time</div>}
        </div>,
    },
  ];
