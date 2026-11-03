import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const payrolls = await prisma.payroll.findMany({
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
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payrolls' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const baseSalary = parseFloat(body.baseSalary);
    const allowance = parseFloat(body.allowance) || 0;
    const bonus = parseFloat(body.bonus) || 0;
    const deductions = parseFloat(body.deductions) || 0;
    const netSalary = baseSalary + allowance + bonus - deductions;

    const payroll = await prisma.payroll.create({
      data: {
        employeeId: parseInt(body.employeeId),
        period: body.period,
        baseSalary,
        allowance,
        bonus,
        deductions,
        netSalary,
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
    return NextResponse.json(payroll, { status: 201 });
  } catch (error) {
    console.error('Error creating payroll:', error);
    return NextResponse.json(
      { error: 'Failed to create payroll' },
      { status: 500 }
    );
  }
}