'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  performance?: any;
  employees: any[];
}

export function PerformanceDialog({ open, onOpenChange, onSuccess, performance, employees }: PerformanceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    score: '',
    notes: '',
  });

  useEffect(() => {
    if (performance) {
      setFormData({
        employeeId: performance.employeeId?.toString() || '',
        period: performance.period || '',
        score: performance.score?.toString() || '',
        notes: performance.notes || '',
      });
    } else {
      setFormData({
        employeeId: '',
        period: '',
        score: '',
        notes: '',
      });
    }
  }, [performance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = performance ? `/api/performance/${performance.id}` : '/api/performance';
      const response = await fetch(url, {
        method: performance ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      alert('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{performance ? 'Edit Performa' : 'Tambah Performa Baru'}</DialogTitle>
          <DialogDescription>Lengkapi form di bawah ini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Karyawan *</label>
            <select 
              required 
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeCode} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Periode *</label>
            <input 
              type="month" 
              required 
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM (contoh: 2024-01)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nilai Performa *</label>
            <input 
              type="number" 
              required 
              step="0.01"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Skala 0-100</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea 
              value={formData.notes}
              rows={4}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Catatan tambahan tentang performa karyawan..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
