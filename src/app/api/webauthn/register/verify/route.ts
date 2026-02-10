import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { origin, rpID } from "@/lib/webauthn";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { email, credential: clientResponse } = await req.json();

  const employee = await prisma.employee.findFirst({
    where: { email },
  });

  if (!employee?.token) {
    return Response.json(
      { error: "Missing WebAuthn challenge" },
      { status: 400 }
    );
  }

  const verification = await verifyRegistrationResponse({
    response: clientResponse,
    expectedChallenge: employee.token,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return Response.json({ error: true }, { status: 400 });
  }

  // ✅ CORRECT for your version
  const { credential } = verification.registrationInfo;

  // await prisma.employee.update({
  //   where: { id: employee.id },
  //   data: {
  //     credentialId: Buffer.from(credential.id),
  //     publicKey: Buffer.from(credential.publicKey),
  //     counter: credential.counter ?? 0,
  //     token: null, // clear challenge
  //   },
  // });

  await prisma.employee.update({
  where: { id: employee.id },
  data: {
    credentialId: Buffer.from(clientResponse.rawId, "base64url"), // ✅ FIX
    publicKey: Buffer.from(credential.publicKey),                 // ✅ already bytes
    counter: credential.counter ?? 0,
    token: null,
  },
});

  return Response.json({ success: true });
}
