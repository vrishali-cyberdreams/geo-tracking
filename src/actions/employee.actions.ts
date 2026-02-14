"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { TEmployee } from "@/lib/schema/employee.schema";
import { Attendance, Employee, Punch } from "@prisma/client";

// EMPLOYEE WITH RELATIONS TYPE
export type EmployeeWithRelations = Employee & {
  attendance: (Attendance & {
    punch: Punch[]
  })[]
}

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

// GET EMPLOYEE INFORMATION
export async function getEmployeeById(
  // accessorId: string,
  employeeId: string
): Promise<Response<EmployeeWithRelations>> {
  try {
    // const canAccess = await auth.api.userHasPermission({
    //   body: {
    //     userId: accessorId,
    //     permissions: {
    //       employee: ["list"],
    //     },
    //   },
    // });

    // if (!canAccess.success) {
    //   return Response.error("You do not have permission to list employees");
    // }

    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId
      },
      include: {
        attendance: {
          include: {
            punch: true
          }
        }
      }
    });

    if (!employee) {
      return Response.error("Employee not found");
    }

    return Response.success(employee);
  } catch (error) {
    console.log(`EMPLOYEE_ACTION/GET_EMPLOYEE_BY_ID: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while fetching the employee, please try again!",
    );
  }
}

// GET EMPLOYEE INFORMATION
export async function getEmployeeByEmail(
  email: string
): Promise<Response<string>> {
  try {

    const employee = await prisma.employee.findFirst({
      where: {
        email: email
      },
      select:{
        id: true
      }
    });

    if (!employee) {
      return Response.error("Employee not found");
    }

    return Response.success(employee.id);
  } catch (error) {
    console.log(`EMPLOYEE_ACTION/GET_EMPLOYEE_BY_EMAIL: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while fetching the employee, please try again!",
    );
  }
}

// CREATE EMPLOYEE
export async function createEmployee(
  data: TEmployee,
): Promise<Response<string>> {
  try {
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        email: data.email
      },
      select: {
        id: true
      }
    });

    if (existingEmployee) {
      return Response.error("Employee with this email already exists");
    }

    const employee = await prisma.employee.create({
      data: data
    });

    if (!employee) {
      return Response.error("Employee creation failed");
    }

    return Response.success(employee.id, "Employee created successfully");
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

// DELETE EMPLOYEE
export async function deleteEmployee(
  employeeId: string
): Promise<Response> {
  try {

    const existingEmployee = await prisma.employee.findFirst({
      where: {
        id: employeeId
      },
      select: {
        id: true
      }
    });

    if (!existingEmployee) {
      return Response.error("Employee not found");
    }

    await prisma.employee.delete({
      where: {
        id: employeeId
      }
    });

    return Response.success(undefined, "Employee deleted successfully");
  } catch (error) {
    console.log(`EMPLOYEE_ACTION/DELETE_EMPLOYEE: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while deleting the employee, please try again!",
    );
  }
}