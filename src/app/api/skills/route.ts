import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personalInfoId = searchParams.get("personalInfoId");

    if (personalInfoId) {
      const skills = await prisma.skill.findMany({
        where: { personalInfoId: parseInt(personalInfoId) },
        orderBy: [{ category: "asc" }, { skillName: "asc" }],
      });
      return NextResponse.json(skills);
    }

    return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const skill = await prisma.skill.create({
      data: {
        personalInfoId: data.personalInfoId,
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
  try {
    const data = await request.json();
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
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.skill.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
