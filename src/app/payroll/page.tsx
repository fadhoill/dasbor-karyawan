'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PayrollDialog } from '../../components/payroll/PayrollDialog';
import { DeletePayrollDialog } from '../../components/payroll/DeletePayrollDialog';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [payRes, empRes] = await Promise.all([
        fetch('/api/payroll'),
        fetch('/api/karyawan'),
      ]);
      const [payData, empData] = await Promise.all([
        payRes.json(),
        empRes.json(),
      ]);
      setPayrolls(payData);
      setEmployees(empData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedPayroll) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/payroll/${selectedPayroll.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchData();
      setDeleteDialogOpen(false);
      setSelectedPayroll(null);
    } catch (error) {
      alert('Gagal menghapus');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    return parseFloat(value as string).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
<div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Payroll Karyawan</h1>
            <p className="text-gray-500 mt-1">Kelola data gaji karyawan</p>
          </div>
          <button 
            onClick={() => { setSelectedPayroll(null); setDialogOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Tambah Payroll
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departemen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gaji Pokok</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tunjangan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Potongan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pay.employee.name}</div>
                    <div className="text-sm text-gray-500">{pay.employee.employeeCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pay.employee.department.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pay.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {formatCurrency(pay.baseSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {formatCurrency(pay.allowance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {formatCurrency(pay.bonus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {formatCurrency(pay.deductions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(pay.netSalary)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => { setSelectedPayroll(pay); setDialogOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => { setSelectedPayroll(pay); setDeleteDialogOpen(true); }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PayrollDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={fetchData}
        payroll={selectedPayroll} 
        employees={employees}
      />
      <DeletePayrollDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm} 
        payrollInfo={selectedPayroll ? `${selectedPayroll.employee.name} - ${selectedPayroll.period}` : ''} 
        loading={deleteLoading}
      />
    </div>
  );
}