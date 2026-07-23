import { auth } from "./auth";
import { headers } from "next/headers";
import { prisma } from "./db";
import { NextResponse } from "next/server";
import type { User } from "better-auth/types";

/** Returns the authenticated user, or null. */
export async function getSessionUser(): Promise<User | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return (session?.user as User | undefined) ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** True if the given PersonalInfo row belongs to the user. */
export async function ownsPersonalInfo(
  personalInfoId: number,
  userId: string,
): Promise<boolean> {
  const info = await prisma.personalInfo.findUnique({
    where: { id: personalInfoId },
    select: { userId: true },
  });
  return info?.userId === userId;
}

type ChildModel = "experience" | "education" | "skill" | "project" | "certification";

/** True if the child record (experience/education/...) belongs to the user. */
export async function ownsChildRecord(
  model: ChildModel,
  id: number,
  userId: string,
): Promise<boolean> {
  const record = await (
    prisma[model] as unknown as {
      findUnique: (args: { where: { id: number }; select: { personalInfoId: true } }) => Promise<{ personalInfoId: number } | null>;
    }
  ).findUnique({ where: { id }, select: { personalInfoId: true } });
  if (!record) return false;
  return ownsPersonalInfo(record.personalInfoId, userId);
}
