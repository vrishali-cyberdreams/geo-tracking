"use client";

import { Button } from "@/components/ui/button";
import { Employee } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EmployeeActions } from "./employee.columnActions";

export const employeeColumns: ColumnDef<Employee>[] =
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
      accessorFn: (row) => row.firstName + " " + row.lastName,
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
      cell: ({ row }) => <div className="px-4">{row.original.firstName + " " + row.original.lastName}</div>,
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
      id: "contact",
      accessorFn: (row) => row.contact,
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contact
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.contact}</div>,
    },
    {
      id: "designation",
      accessorFn: (row) => row.designation,
      header: ({ column }) => {
        return (
          <Button
            className="font-bold w-full justify-between"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Designation
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="px-4">{row.original.designation}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <EmployeeActions employeeId={row.original.id} />
      ),
    },
  ];
