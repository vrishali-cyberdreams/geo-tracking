"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Response } from "@/lib/response";
import { User } from "@prisma/client";

// GET ALL USERS
export async function getAllUsers(
  accessorId: string,
): Promise<Response<User[]>> {
  try {
    const canAccess = await auth.api.userHasPermission({
      body: {
        userId: accessorId,
        permissions: {
          user: ["list"],
        },
      },
    });

    if (!canAccess.success) {
      return Response.error("You do not have permission to list users");
    }

    const users = await prisma.user.findMany();
    return Response.success(users);
  } catch (error) {
    console.log(`USER_ACTION/GET_ALL_USERS: ${(error as Error).message}`);
    if (process.env.NODE_ENV === "development") {
      return Response.error((error as Error).message);
    }
    return Response.error(
      "Something went wrong while fetching the users, please try again!",
    );
  }
}