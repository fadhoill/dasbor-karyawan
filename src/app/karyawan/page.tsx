'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { EmployeeDialog } from '../../components/karyawan/EmployeeDialog';
import { DeleteEmployeeDialog } from '../../components/karyawan/DeleteEmployeeDialog';

export default function KaryawanPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        fetch('/api/karyawan'), fetch('/api/departemen'), fetch('/api/posisi'),
      ]);
      const [empData, deptData, posData] = await Promise.all([
        empRes.json(), deptRes.json(), posRes.json(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setPositions(posData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/karyawan/${selectedEmployee.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchData();
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      alert('Gagal menghapus');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getBadge = (s: string) => {
    const styles: any = {
      PERMANENT: 'bg-green-100 text-green-800', CONTRACT: 'bg-blue-100 text-blue-800',
      INTERN: 'bg-yellow-100 text-yellow-800', RESIGNED: 'bg-red-100 text-red-800',
    };
    return styles[s] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Karyawan</h1>
            <p className="text-gray-500 mt-1">Kelola data karyawan perusahaan</p>
          </div>
          <button onClick={() => { setSelectedEmployee(null); setDialogOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-5 w-5" />Tambah Karyawan
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{emp.employeeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/karyawan/${emp.id}`} className="text-blue-600 hover:text-blue-900 underline">
                      {emp.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadge(emp.employmentStatus)}`}>
                      {emp.employmentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => { setSelectedEmployee(emp); setDialogOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-3">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setSelectedEmployee(emp); setDeleteDialogOpen(true); }}
                      className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchData}
        employee={selectedEmployee} departments={departments} positions={positions} />
      <DeleteEmployeeDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm} employeeName={selectedEmployee?.name || ''} loading={deleteLoading} />
    </div>
  );
}

