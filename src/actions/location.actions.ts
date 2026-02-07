"use server"

import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { TLocation } from "@/lib/schema/location.schema";

// ADD LOCATION
export async function createLocation(data: TLocation): Promise<Response> {
  try {
    const { email, ...rest } = data;

    const user = await prisma.user.findFirst({
      where: {
        email: email
      },
      select: {
        id: true
      }
    });

    if (!user) {
      return Response.error("User with this email does not exist");
    }

    await prisma.location.create({
      data: {
        ...rest,
        lat: rest.lat ?? 0,
        long: rest.long ?? 0,
        userId: user.id
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
