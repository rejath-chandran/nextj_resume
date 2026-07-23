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

    const experiences = await prisma.experience.findMany({
      where: { personalInfoId: pid },
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const pid = data.personalInfoId;
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const experience = await prisma.experience.create({
      data: {
        personalInfoId: pid,
        company: data.company,
        position: data.position,
        location: data.location || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
        currentJob: data.currentJob || false,
        description: data.description || null,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    if (!(await ownsChildRecord("experience", data.id, user.id))) return forbidden();

    const experience = await prisma.experience.update({
      where: { id: data.id },
      data: {
        company: data.company,
        position: data.position,
        location: data.location || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
        currentJob: data.currentJob || false,
        description: data.description || null,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const numericId = parseInt(id);
    if (!(await ownsChildRecord("experience", numericId, user.id))) return forbidden();

    await prisma.experience.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
