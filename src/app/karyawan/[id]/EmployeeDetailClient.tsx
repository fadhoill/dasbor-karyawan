'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Calendar, Mail, Phone, MapPin, Briefcase, User, DollarSign, Award } from 'lucide-react';
import Link from 'next/link';
import { EmployeeDialog } from '@/components/karyawan/EmployeeDialog';
import { DeleteEmployeeDialog } from '@/components/karyawan/DeleteEmployeeDialog';

interface EmployeeDetailClientProps {
  employee: {
    id: number;
    employeeCode: string;
    name: string;
    email: string;
    phone: string | null;
    gender: string;
    birthDate: Date | string;
    address: string | null;
    education: string;
    employmentStatus: string;
    joinDate: Date | string;
    departmentId: number;
    positionId: number;
    department: { id: number; name: string };
    position: { id: number; name: string };
    payrolls: Array<{
      id: number;
      period: string;
      baseSalary: string | number;
      allowance: string | number;
      bonus: string | number;
      deductions: string | number;
      netSalary: string | number;
    }>;
    performances: Array<{
      id: number;
      period: string;
      score: number;
      notes: string | null;
    }>;
  };
}

export function EmployeeDetailClient({ employee }: EmployeeDetailClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);

  const fetchDepartmentsAndPositions = async () => {
    try {
      const [deptRes, posRes] = await Promise.all([
        fetch('/api/departemen'),
        fetch('/api/posisi'),
      ]);
      const [deptData, posData] = await Promise.all([
        deptRes.json(), posRes.json(),
      ]);
      setDepartments(deptData);
      setPositions(posData);
    } catch (error) {
      console.error('Error fetching departments/positions:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/karyawan/${employee.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.push('/karyawan');
    } catch (error) {
      alert('Gagal menghapus');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = () => {
    router.refresh();
    setDialogOpen(false);
  };

  const getBadge = (s: string) => {
    const styles: Record<string, string> = {
      PERMANENT: 'bg-green-100 text-green-800',
      CONTRACT: 'bg-blue-100 text-blue-800',
      INTERN: 'bg-yellow-100 text-yellow-800',
      RESIGNED: 'bg-red-100 text-red-800',
    };
    return styles[s] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: Date | string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (value: number | string) => {
    return parseFloat(value as string).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/karyawan" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5" /> Kembali
        </Link>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-gray-500 mt-1">{employee.employeeCode} &bull; {employee.department.name} / {employee.position.name}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadge(employee.employmentStatus)}`}>
                {employee.employmentStatus}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" /> Info Pribadi
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Kode Karyawan</dt>
                    <dd className="font-medium">{employee.employeeCode}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium"><Mail className="h-4 w-4 inline mr-1" /> {employee.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Telepon</dt>
                    <dd className="font-medium"><Phone className="h-4 w-4 inline mr-1" /> {employee.phone || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Jenis Kelamin</dt>
                    <dd className="font-medium">{employee.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tanggal Lahir</dt>
                    <dd className="font-medium"><Calendar className="h-4 w-4 inline mr-1" /> {formatDate(employee.birthDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Alamat</dt>
                    <dd className="font-medium"><MapPin className="h-4 w-4 inline mr-1" /> {employee.address || '-'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-400" /> Info Kepegawaian
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Pendidikan</dt>
                    <dd className="font-medium">{employee.education}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tanggal Bergabung</dt>
                    <dd className="font-medium"><Calendar className="h-4 w-4 inline mr-1" /> {formatDate(employee.joinDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Departemen</dt>
                    <dd className="font-medium">{employee.department.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Posisi</dt>
                    <dd className="font-medium">{employee.position.name}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {employee.payrolls.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-400" /> Riwayat Gaji (12 Bulan Terakhir)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Gaji Pokok</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tunjangan</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Potongan</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employee.payrolls.map((payroll: any) => (
                        <tr key={payroll.id}>
                          <td className="px-4 py-2 text-sm">{payroll.period}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(payroll.baseSalary)}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(payroll.allowance)}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(payroll.bonus)}</td>
                          <td className="px-4 py-2 text-sm text-right text-red-600">{formatCurrency(payroll.deductions)}</td>
                          <td className="px-4 py-2 text-sm font-semibold text-right">{formatCurrency(payroll.netSalary)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {employee.performances.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-400" /> Riwayat Performa
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nilai</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employee.performances.map((perf: any) => (
                        <tr key={perf.id}>
                          <td className="px-4 py-2 text-sm">{perf.period}</td>
                          <td className="px-4 py-2 text-sm font-semibold">{perf.score}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{perf.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button 
                onClick={() => { fetchDepartmentsAndPositions(); setDialogOpen(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button 
                onClick={() => setDeleteDialogOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            </div>
          </div>
        </div>

        <EmployeeDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          onSuccess={handleEditSuccess}
          employee={employee} 
          departments={departments} 
          positions={positions} 
        />
        <DeleteEmployeeDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm} 
          employeeName={employee.name} 
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}