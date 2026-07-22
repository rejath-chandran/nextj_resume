import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personalInfoId = searchParams.get("personalInfoId");

    if (personalInfoId) {
      const certifications = await prisma.certification.findMany({
        where: { personalInfoId: parseInt(personalInfoId) },
        orderBy: { issueDate: "desc" },
      });
      return NextResponse.json(certifications);
    }

    return NextResponse.json({ error: "personalInfoId is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const certification = await prisma.certification.create({
      data: {
        personalInfoId: data.personalInfoId,
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        issueDate: data.issueDate || null,
        expirationDate: data.expirationDate || null,
        credentialUrl: data.credentialUrl || null,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const certification = await prisma.certification.update({
      where: { id: data.id },
      data: {
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        issueDate: data.issueDate || null,
        expirationDate: data.expirationDate || null,
        credentialUrl: data.credentialUrl || null,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.certification.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
