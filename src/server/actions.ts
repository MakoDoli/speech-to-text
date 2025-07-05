"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function checkIfUserPaid() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.voiceUser.findUnique({
    where: { clerkId: userId },
    select: { isPaid: true },
  });

  return user?.isPaid || false;
}
