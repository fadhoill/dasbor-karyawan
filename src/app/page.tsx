import { prisma } from "@/lib/prismaClient";
import DashboardCharts from "@/components/DashboardCharts";
import { Suspense } from "react";



async function getDashboardData() {
  const [
    totalEmployees,
    employeesByDept,
    employeesByStatus,
    payrollStats,
    recentEmployees,
    topEmployees,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.groupBy({
      by: ["departmentId"],
      _count: true,
    }),
    prisma.employee.groupBy({
      by: ["employmentStatus"],
      _count: true,
    }),
    prisma.payroll.aggregate({
      _avg: { netSalary: true },
      _sum: { netSalary: true },
    }),
    prisma.employee.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { department: true, position: true },
    }),
    prisma.performance.findMany({
      take: 5,
      orderBy: { score: "desc" },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
      },
    }),
  ]);

  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  const deptData = employeesByDept.map((item) => ({
    name: deptMap.get(item.departmentId) || "Unknown",
    value: item._count,
  }));

  const statusData = employeesByStatus.map((item) => ({
    name: item.employmentStatus,
    value: item._count,
  }));

  return {
    totalEmployees,
    totalDepartments: departments.length,
    avgSalary: payrollStats._avg.netSalary || 0,
    totalPayroll: payrollStats._sum.netSalary || 0,
    deptData,
    statusData,
    recentEmployees,
    topEmployees,
  };
}

export default async function Home() {

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Dashboard Karyawan
        </h1>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">
            Total Karyawan
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {data.totalEmployees}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">
            Total Departemen
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {data.totalDepartments}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">
            Rata-rata Gaji
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(Number(data.avgSalary))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Payroll</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(Number(data.totalPayroll))}
          </div>
        </div>
      </div>

      

      {/* Charts */}
      <DashboardCharts deptData={data.deptData} statusData={data.statusData} />
      {/* Top 5 Employees */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            🏆 Top 5 Karyawan Terbaik
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Berdasarkan skor performa tertinggi
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.topEmployees.map((perf, index) => {
              const rankColors = [
                "bg-yellow-100 text-yellow-800 border-yellow-300",
                "bg-gray-100 text-gray-800 border-gray-300",
                "bg-orange-100 text-orange-800 border-orange-300",
                "bg-blue-50 text-blue-700 border-blue-200",
                "bg-purple-50 text-purple-700 border-purple-200",
              ];
              const rankEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
              
              return (
                <div
                  key={perf.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${rankColors[index]} transition-all hover:shadow-md`}
                >
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center text-2xl font-bold">
                    {rankEmojis[index]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {perf.employee.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        ({perf.employee.employeeCode})
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{perf.employee.position.name}</span>
                      <span>•</span>
                      <span>{perf.employee.department.name}</span>
                    </div>
                    {perf.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        "{perf.notes}"
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {perf.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Skor</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Recent Employees Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Karyawan Terbaru
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Departemen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Posisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.employeeCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emp.department.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emp.position.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.employmentStatus === "PERMANENT"
                          ? "bg-green-100 text-green-800"
                          : emp.employmentStatus === "CONTRACT"
                            ? "bg-blue-100 text-blue-800"
                            : emp.employmentStatus === "INTERN"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-28 bg-gray-200 rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((item) => (
          <div key={item} className="h-80 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
