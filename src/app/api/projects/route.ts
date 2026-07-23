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

    const projects = await prisma.project.findMany({
      where: { personalInfoId: pid },
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const pid = data.personalInfoId;
    if (!(await ownsPersonalInfo(pid, user.id))) return forbidden();

    const project = await prisma.project.create({
      data: {
        personalInfoId: pid,
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
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    if (!(await ownsChildRecord("project", data.id, user.id))) return forbidden();

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
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const numericId = parseInt(id);
    if (!(await ownsChildRecord("project", numericId, user.id))) return forbidden();

    await prisma.project.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
