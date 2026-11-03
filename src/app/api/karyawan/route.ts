import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const employee = await prisma.employee.create({
      data: {
        employeeCode: body.employeeCode,
        name: body.name,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        birthDate: new Date(body.birthDate),
        address: body.address,
        education: body.education,
        employmentStatus: body.employmentStatus,
        joinDate: new Date(body.joinDate),
        departmentId: parseInt(body.departmentId),
        positionId: parseInt(body.positionId),
      },
      include: {
        department: true,
        position: true,
      },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
