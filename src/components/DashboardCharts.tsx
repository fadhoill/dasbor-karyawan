"use client";

"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Sector,
  PieSectorShapeProps,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const EmploymentStatusSector = (props: PieSectorShapeProps) => (
  <Sector {...props} fill={COLORS[props.index % COLORS.length]} />
);

interface ChartProps {
  genderData: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
}

export default function DashboardCharts({ genderData, statusData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Gender Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Karyawan per Gender</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employment Status Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Status Kepegawaian</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              shape={EmploymentStatusSector}
              label={({ name, value }) => `${name}: ${value}`}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
