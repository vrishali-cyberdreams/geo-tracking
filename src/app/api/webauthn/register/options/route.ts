import { generateRegistrationOptions } from "@simplewebauthn/server";
import { rpID, rpName } from "@/lib/webauthn";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const employee = await prisma.employee.findFirst({
    where: { email },
  });

  if (!employee) {
    return Response.json({ error: "Employee not found" }, { status: 404 });
  }

  if (employee.credentialId) {
    return Response.json(
      { error: "Device already registered" },
      { status: 400 }
    );
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(employee.id),
    userName: employee.email,
    timeout: 60000,
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "required",
    },
  });

  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      token: options.challenge,
    },
  });

  return Response.json(options);
}
