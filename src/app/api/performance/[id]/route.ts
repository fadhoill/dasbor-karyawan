import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const performance = await prisma.performance.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
      },
    });
    
    if (!performance) {
      return NextResponse.json(
        { error: 'Performance not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const performance = await prisma.performance.update({
      where: { id: parseInt(id) },
      data: {
        employeeId: parseInt(body.employeeId),
        period: body.period,
        score: parseFloat(body.score),
        notes: body.notes || null,
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error updating performance:', error);
    return NextResponse.json(
      { error: 'Failed to update performance' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.performance.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting performance:', error);
    return NextResponse.json(
      { error: 'Failed to delete performance' },
      { status: 500 }
    );
  }
}
