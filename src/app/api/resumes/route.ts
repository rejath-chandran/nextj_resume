import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getSessionUser,
  unauthorized,
  forbidden,
  ownsPersonalInfo,
} from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

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

      if (!resume || resume.userId !== user.id) {
        return forbidden();
      }
      return NextResponse.json(resume);
    }

    const resumes = await prisma.personalInfo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

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
        title: data.title || null,
        userId: user.id,
      },
    });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const id = data.id;
    if (!(await ownsPersonalInfo(id, user.id))) return forbidden();

    const resume = await prisma.personalInfo.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        summary: data.summary || null,
        title: data.title || null,
      },
    });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const numericId = parseInt(id);
    if (!(await ownsPersonalInfo(numericId, user.id))) return forbidden();

    await prisma.personalInfo.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const data = await request.json();
    const { id, resumeName } = data;

    if (!id || typeof resumeName !== "string") {
      return NextResponse.json({ error: "ID and resumeName are required" }, { status: 400 });
    }

    if (!(await ownsPersonalInfo(id, user.id))) return forbidden();

    const resume = await prisma.personalInfo.update({
      where: { id },
      data: { resumeName: resumeName.trim() || null },
    });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error renaming resume:", error);
    return NextResponse.json({ error: "Failed to rename resume" }, { status: 500 });
  }
}
