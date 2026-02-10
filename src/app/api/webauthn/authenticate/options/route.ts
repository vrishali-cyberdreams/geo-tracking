import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/db";
import { rpID } from "@/lib/webauthn";

export function bufferToBase64URL(buffer: Buffer | Uint8Array): string {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function POST(req: Request) {
  const { email } = await req.json();

  const employee = await prisma.employee.findFirst({
    where: { email },
  });

  if (!employee || !employee.credentialId) {
    return Response.json(
      { error: "Device not registered" },
      { status: 400 }
    );
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: [
      {
        id: bufferToBase64URL(employee.credentialId), // ONLY this device
      },
    ],
    userVerification: "required",
  });

  // store challenge temporarily
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      token: options.challenge,
    },
  });

  return Response.json(options);
}
