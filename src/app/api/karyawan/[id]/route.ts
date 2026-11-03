import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true,
        position: true,
      },
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
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
    
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
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
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
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
    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
