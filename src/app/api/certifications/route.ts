import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getSessionUser,
  unauthorized,
  forbidden,
  ownsPersonalInfo,
  ownsChildRecord,
} from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const personalInfoId = request.nextUrl.searchParams.get("personalInfoId");
    if (!personalInfoId) {
      return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
    }
    const pid = parseInt(personalInfoId);
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const certifications = await prisma.certification.findMany({
      where: { personalInfoId: pid },
      orderBy: { issueDate: "desc" },
    });
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const pid = data.personalInfoId;
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const certification = await prisma.certification.create({
      data: {
        personalInfoId: pid,
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        issueDate: data.issueDate || null,
        expirationDate: data.expirationDate || null,
        credentialUrl: data.credentialUrl || null,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    if (!(await ownsChildRecord("certification", data.id, user.id))) return forbidden();

    const certification = await prisma.certification.update({
      where: { id: data.id },
      data: {
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        issueDate: data.issueDate || null,
        expirationDate: data.expirationDate || null,
        credentialUrl: data.credentialUrl || null,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const numericId = parseInt(id);
    if (!(await ownsChildRecord("certification", numericId, user.id))) return forbidden();

    await prisma.certification.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
