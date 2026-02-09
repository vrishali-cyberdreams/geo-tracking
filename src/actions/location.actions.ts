"use server"

import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { TLocation } from "@/lib/schema/location.schema";
import { Location } from "@prisma/client";

// ADD LOCATION
export async function createLocation(data: TLocation): Promise<Response> {
  try {
    const { email, ...rest } = data;

    const employee = await prisma.employee.findFirst({
      where: {
        email: email
      },
      select: {
        id: true
      }
    });

    if (!employee) {
      return Response.error("Employee with this email does not exist");
    }

    await prisma.location.create({
      data: {
        ...rest,
        lat: rest.lat ?? 0,
        long: rest.long ?? 0,
        displayName: rest.displayName ?? "",
        employeeId: employee.id
      }
    });

    return Response.success(undefined, "Location added successfully");
  } catch (error) {
    console.log(`LOCATION_ACTION/CREATE_LOCATION: ${(error as Error).message}`);
    if (process.env.NODE_ENV == "development") {
      return Response.error((error as Error).message);
    }
    return Response.error("An error occurred while saving the location");
  }
}

// GET EMPLOYEE LOCATIONS
export async function getLocations(employeeId: string): Promise<Response<Location[]>> {
  try {
    const locations = await prisma.location.findMany({
      where: {
        employeeId: employeeId
      }
    });

    return Response.success(locations);
  } catch (error) {
    console.log(`LOCATION_ACTION/GET_EMPLOYEE_LOCATIONS: ${(error as Error).message}`);
    if (process.env.NODE_ENV == "development") {
      return Response.error((error as Error).message);
    }
    return Response.error("An error occurred while fetching employee locations");
  }
}
