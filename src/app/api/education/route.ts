import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personalInfoId = searchParams.get("personalInfoId");

    if (personalInfoId) {
      const education = await prisma.education.findMany({
        where: { personalInfoId: parseInt(personalInfoId) },
        orderBy: { graduationDate: "desc" },
      });
      return NextResponse.json(education);
    }

    return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const education = await prisma.education.create({
      data: {
        personalInfoId: data.personalInfoId,
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
  try {
    const data = await request.json();
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
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.education.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
