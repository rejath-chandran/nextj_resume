import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personalInfoId = searchParams.get("personalInfoId");

    if (personalInfoId) {
      const experiences = await prisma.experience.findMany({
        where: { personalInfoId: parseInt(personalInfoId) },
        orderBy: { startDate: "desc" },
      });
      return NextResponse.json(experiences);
    }

    return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const experience = await prisma.experience.create({
      data: {
        personalInfoId: data.personalInfoId,
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
  try {
    const data = await request.json();
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
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.experience.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
