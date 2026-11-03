import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payroll = await prisma.payroll.findUnique({
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
    
    if (!payroll) {
      return NextResponse.json(
        { error: 'Payroll not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payroll' },
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
    const baseSalary = parseFloat(body.baseSalary);
    const allowance = parseFloat(body.allowance) || 0;
    const bonus = parseFloat(body.bonus) || 0;
    const deductions = parseFloat(body.deductions) || 0;
    const netSalary = baseSalary + allowance + bonus - deductions;
    
    const payroll = await prisma.payroll.update({
      where: { id: parseInt(id) },
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
    return NextResponse.json(payroll);
  } catch (error) {
    console.error('Error updating payroll:', error);
    return NextResponse.json(
      { error: 'Failed to update payroll' },
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
    await prisma.payroll.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    return NextResponse.json(
      { error: 'Failed to delete payroll' },
      { status: 500 }
    );
  }
}