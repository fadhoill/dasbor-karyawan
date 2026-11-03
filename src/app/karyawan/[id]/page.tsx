
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prismaClient";
import { EmployeeDetailClient } from "./EmployeeDetailClient";
import { EmployeeDetailSkeleton } from "./EmployeeDetailSkeleton";

export default async function EmployeeDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<EmployeeDetailSkeleton />}>
      <EmployeeDetailContent params={params} />
    </Suspense>
  );
}

async function EmployeeDetailContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employeeId = parseInt(id, 10);

  if (isNaN(employeeId)) {
    notFound();
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      department: true,
      position: true,
      payrolls: {
        orderBy: { period: "desc" },
        take: 12,
      },
      performances: {
        orderBy: { period: "desc" },
        take: 12,
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const employeeData = {
    ...employee,
    payrolls: employee.payrolls.map((p) => ({
      id: p.id,
      period: p.period,
      baseSalary: p.baseSalary.toString(),
      allowance: p.allowance.toString(),
      bonus: p.bonus.toString(),
      deductions: p.deductions.toString(),
      netSalary: p.netSalary.toString(),
    })),
  };

  return <EmployeeDetailClient employee={employeeData} />;
}
