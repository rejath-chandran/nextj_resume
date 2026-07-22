import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personalInfoId = searchParams.get("personalInfoId");

    if (personalInfoId) {
      const projects = await prisma.project.findMany({
        where: { personalInfoId: parseInt(personalInfoId) },
        orderBy: { startDate: "desc" },
      });
      return NextResponse.json(projects);
    }

    return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        personalInfoId: data.personalInfoId,
        name: data.name,
        description: data.description || null,
        technologies: data.technologies || null,
        projectUrl: data.projectUrl || null,
        githubUrl: data.githubUrl || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        technologies: data.technologies || null,
        projectUrl: data.projectUrl || null,
        githubUrl: data.githubUrl || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
