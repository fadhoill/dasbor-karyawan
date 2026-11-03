'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee?: any;
  departments: any[];
  positions: any[];
}

export function EmployeeDialog({ open, onOpenChange, onSuccess, employee, departments, positions }: EmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '', name: '', email: '', phone: '', gender: 'MALE', birthDate: '', 
    address: '', education: 'BACHELOR', employmentStatus: 'CONTRACT', joinDate: '', 
    departmentId: '', positionId: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeCode: employee.employeeCode || '', name: employee.name || '', email: employee.email || '',
        phone: employee.phone || '', gender: employee.gender || 'MALE',
        birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : '',
        address: employee.address || '', education: employee.education || 'BACHELOR',
        employmentStatus: employee.employmentStatus || 'CONTRACT',
        joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : '',
        departmentId: employee.departmentId?.toString() || '', positionId: employee.positionId?.toString() || '',
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = employee ? `/api/karyawan/${employee.id}` : '/api/karyawan';
      const response = await fetch(url, {
        method: employee ? 'PUT' : 'POST',
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

  const Field = ({ label, required, type = 'text', field, options }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label} {required && '*'}</label>
      {type === 'select' ? (
        <select required={required} value={formData[field as keyof typeof formData]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg">
          {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={formData[field as keyof typeof formData]} rows={3}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg" />
      ) : (
        <input type={type} required={required} value={formData[field as keyof typeof formData]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg" />
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</DialogTitle>
          <DialogDescription>Lengkapi form di bawah ini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kode Karyawan" required field="employeeCode" />
            <Field label="Nama Lengkap" required field="name" />
            <Field label="Email" required type="email" field="email" />
            <Field label="No. Telepon" field="phone" />
            <Field label="Jenis Kelamin" required type="select" field="gender" 
              options={[{value:'MALE',label:'Laki-laki'},{value:'FEMALE',label:'Perempuan'}]} />
            <Field label="Tanggal Lahir" required type="date" field="birthDate" />
            <Field label="Pendidikan" required type="select" field="education"
              options={[{value:'HIGH_SCHOOL',label:'SMA/SMK'},{value:'DIPLOMA',label:'Diploma'},
                {value:'BACHELOR',label:'S1'},{value:'MASTER',label:'S2'},{value:'DOCTORATE',label:'S3'}]} />
            <Field label="Status Kepegawaian" required type="select" field="employmentStatus"
              options={[{value:'PERMANENT',label:'Permanent'},{value:'CONTRACT',label:'Kontrak'},
                {value:'INTERN',label:'Magang'},{value:'RESIGNED',label:'Resign'}]} />
            <Field label="Tanggal Bergabung" required type="date" field="joinDate" />
            <Field label="Departemen" required type="select" field="departmentId"
              options={[{value:'',label:'Pilih Departemen'},...departments.map(d=>({value:d.id,label:d.name}))]} />
            <Field label="Posisi" required type="select" field="positionId"
              options={[{value:'',label:'Pilih Posisi'},...positions.map(p=>({value:p.id,label:p.name}))]} />
          </div>
          <Field label="Alamat" type="textarea" field="address" />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => onOpenChange(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
