'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PerformanceDialog } from '../../components/performance/PerformanceDialog';
import { DeletePerformanceDialog } from '../../components/performance/DeletePerformanceDialog';

export default function PerformancePage() {
  const [performances, setPerformances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [perfRes, empRes] = await Promise.all([
        fetch('/api/performance'),
        fetch('/api/karyawan'),
      ]);
      const [perfData, empData] = await Promise.all([
        perfRes.json(),
        empRes.json(),
      ]);
      setPerformances(perfData);
      setEmployees(empData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedPerformance) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/performance/${selectedPerformance.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchData();
      setDeleteDialogOpen(false);
      setSelectedPerformance(null);
    } catch (error) {
      alert('Gagal menghapus');
    } finally {
      setDeleteLoading(false);
    }
  };



  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Performa Karyawan</h1>
            <p className="text-gray-500 mt-1">Kelola data performa karyawan</p>
          </div>
          <button 
            onClick={() => { setSelectedPerformance(null); setDialogOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Tambah Performa
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departemen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performances.map((perf) => (
                <tr key={perf.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{perf.employee.name}</div>
                    <div className="text-sm text-gray-500">{perf.employee.employeeCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {perf.employee.department.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{perf.score}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {perf.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => { setSelectedPerformance(perf); setDialogOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => { setSelectedPerformance(perf); setDeleteDialogOpen(true); }}
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

      <PerformanceDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={fetchData}
        performance={selectedPerformance} 
        employees={employees}
      />
      <DeletePerformanceDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm} 
        performanceInfo={selectedPerformance ? `${selectedPerformance.employee.name} - ${selectedPerformance.period}` : ''} 
        loading={deleteLoading}
      />
    </div>
  );
}
