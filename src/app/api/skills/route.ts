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

    const skills = await prisma.skill.findMany({
      where: { personalInfoId: pid },
      orderBy: [{ category: "asc" }, { skillName: "asc" }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const pid = data.personalInfoId;
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const skill = await prisma.skill.create({
      data: {
        personalInfoId: pid,
        category: data.category,
        skillName: data.skillName,
        proficiencyLevel: data.proficiencyLevel || "intermediate",
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    if (!(await ownsChildRecord("skill", data.id, user.id))) return forbidden();

    const skill = await prisma.skill.update({
      where: { id: data.id },
      data: {
        category: data.category,
        skillName: data.skillName,
        proficiencyLevel: data.proficiencyLevel || "intermediate",
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const numericId = parseInt(id);
    if (!(await ownsChildRecord("skill", numericId, user.id))) return forbidden();

    await prisma.skill.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
