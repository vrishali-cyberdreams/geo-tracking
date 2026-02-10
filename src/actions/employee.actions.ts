"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { Employee } from "@prisma/client";

// GET ALL EMPLOYEES
export async function getAllEmployees(
  accessorId: string,
): Promise<Response<Employee[]>> {
  try {
    const canAccess = await auth.api.userHasPermission({
      body: {
        userId: accessorId,
        permissions: {
          employee: ["list"],
        },
      },
    });

    if (!canAccess.success) {
      return Response.error("You do not have permission to list employees");
    }

    const employees = await prisma.employee.findMany();
    return Response.success(employees);
  } catch (error) {
    console.log(`EMPLOYEE_ACTION/GET_ALL_EMPLOYEES: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while fetching the employees, please try again!",
    );
  }
}

// CREATE EMPLOYEE
export async function createEmployee(
  data: Partial<Employee>,
): Promise<Response> {
  try {

    const existingEmployee = await prisma.employee.findFirst({
      where:{
        email: data.email
      },
      select:{
        id: true
      }
    });

    if(existingEmployee){
      return Response.error("Employee with this email already exists");
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        contact: data.contact ?? "",
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        designation: data.designation ?? "",
        email: data.email ?? "",
      }
    });

    if (!employee) {
      return Response.error("Employee creation failed");
    }

    return Response.success(undefined, "Employee created successfully");
  } catch (error) {
    console.log(`EMPLOYEE_ACTION/CREATE_EMPLOYEE: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while creating the employee, please try again!",
    );
  }
}