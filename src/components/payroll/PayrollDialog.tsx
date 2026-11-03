'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PayrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  payroll?: any;
  employees: any[];
}

export function PayrollDialog({ open, onOpenChange, onSuccess, payroll, employees }: PayrollDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    baseSalary: '',
    allowance: '',
    bonus: '',
    deductions: '',
  });

  useEffect(() => {
    if (payroll) {
      setFormData({
        employeeId: payroll.employeeId?.toString() || '',
        period: payroll.period || '',
        baseSalary: payroll.baseSalary?.toString() || '',
        allowance: payroll.allowance?.toString() || '0',
        bonus: payroll.bonus?.toString() || '0',
        deductions: payroll.deductions?.toString() || '0',
      });
    } else {
      setFormData({
        employeeId: '',
        period: '',
        baseSalary: '',
        allowance: '0',
        bonus: '0',
        deductions: '0',
      });
    }
  }, [payroll, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = payroll ? `/api/payroll/${payroll.id}` : '/api/payroll';
      const response = await fetch(url, {
        method: payroll ? 'PUT' : 'POST',
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
          <DialogTitle>{payroll ? 'Edit Payroll' : 'Tambah Payroll Baru'}</DialogTitle>
          <DialogDescription>Lengkapi form di bawah ini. Net salary dihitung otomatis.</DialogDescription>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gaji Pokok *</label>
              <input 
                type="number" 
                required 
                step="0.01"
                min="0"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tunjangan</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bonus</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Potongan</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Net Salary:</span>
              <span className="font-bold text-blue-600">
                {(parseFloat(formData.baseSalary) + parseFloat(formData.allowance) + parseFloat(formData.bonus) - parseFloat(formData.deductions)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </span>
            </div>
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