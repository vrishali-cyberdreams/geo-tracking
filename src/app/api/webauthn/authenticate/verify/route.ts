import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/db";
import { origin, rpID } from "@/lib/webauthn";
import { bufferToBase64URL } from "../options/route";

export async function POST(req: Request) {
  const { email, credential } = await req.json();

  const employee = await prisma.employee.findFirst({
    where: { email },
  });

  if (
    !employee ||
    !employee.token ||
    !employee.publicKey ||
    !employee.credentialId
  ) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: employee.token, // OK for serverless
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: bufferToBase64URL(employee.credentialId),
      publicKey: employee.publicKey,
      counter: employee.counter ?? 0,
    },
  });

  if (!verification.verified) {
    return Response.json(
      { error: "This device is not registered" },
      { status: 401 }
    );
  }

  // ✅ ONLY update on success
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      counter: verification.authenticationInfo.newCounter,
    },
  });

  return Response.json({ success: true });
}
