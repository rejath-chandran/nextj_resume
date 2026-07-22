import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const resume = await prisma.personalInfo.findUnique({
        where: { id: parseInt(id) },
        include: {
          experiences: { orderBy: { startDate: "desc" } },
          education: { orderBy: { graduationDate: "desc" } },
          skills: { orderBy: [{ category: "asc" }, { skillName: "asc" }] },
          projects: { orderBy: { startDate: "desc" } },
          certifications: { orderBy: { issueDate: "desc" } },
        },
      });
      return NextResponse.json(resume);
    }

    const resumes = await prisma.personalInfo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const resume = await prisma.personalInfo.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        summary: data.summary || null,
      },
    });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const resume = await prisma.personalInfo.update({
      where: { id: data.id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        summary: data.summary || null,
      },
    });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.personalInfo.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
