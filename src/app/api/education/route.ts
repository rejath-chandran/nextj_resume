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

    const education = await prisma.education.findMany({
      where: { personalInfoId: pid },
      orderBy: { graduationDate: "desc" },
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const pid = data.personalInfoId;
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const education = await prisma.education.create({
      data: {
        personalInfoId: pid,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy || null,
        location: data.location || null,
        graduationDate: data.graduationDate || null,
        gpa: data.gpa || null,
      },
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    if (!(await ownsChildRecord("education", data.id, user.id))) return forbidden();

    const education = await prisma.education.update({
      where: { id: data.id },
      data: {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy || null,
        location: data.location || null,
        graduationDate: data.graduationDate || null,
        gpa: data.gpa || null,
      },
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const numericId = parseInt(id);
    if (!(await ownsChildRecord("education", numericId, user.id))) return forbidden();

    await prisma.education.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
