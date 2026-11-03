import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const performances = await prisma.performance.findMany({
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(performances);
  } catch (error) {
    console.error('Error fetching performances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const performance = await prisma.performance.create({
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
    return NextResponse.json(performance, { status: 201 });
  } catch (error) {
    console.error('Error creating performance:', error);
    return NextResponse.json(
      { error: 'Failed to create performance' },
      { status: 500 }
    );
  }
}
