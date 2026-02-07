"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { UsersActions } from "./users.columnActions";

export const userColumns: ColumnDef<User>[] =
  [
    {
      id: "serialNo",
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sr No
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.index + 1}</div>,
    },
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.name}</div>,
    },
    {
      id: "email",
      accessorFn: (row) => row.email,
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.email}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <UsersActions userId={row.original.id} />
      ),
    },
  ];
