# Dasbor Karyawan

Aplikasi manajemen karyawan berbasis web untuk mengelola data karyawan, penggajian (payroll), dan evaluasi kinerja (performance) karyawan.

## Fitur Utama

- **Dashboard**: Visualisasi data karyawan dengan grafik dan statistik
- **Manajemen Karyawan**: CRUD data karyawan lengkap dengan informasi pribadi, departemen, dan posisi
- **Detail Karyawan**: Halaman detail menampilkan riwayat payroll dan performance
- **Manajemen Payroll**: Pencatatan gaji bulanan dengan komponen gaji dasar, tunjangan, bonus, dan potongan
- **Manajemen Performance**: Evaluasi kinerja karyawan per periode dengan skor dan catatan
- **Manajemen Departemen**: Mengelola departemen dalam organisasi
- **Manajemen Posisi**: Mengelola jabatan/posisi karyawan

## Tech Stack

- **Framework**: Next.js 16.4.4 (App Router)
- **UI Library**: React 19.3.0
- **Styling**: Tailwind CSS 4
- **Component**: shadcn/ui, Base UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: PostgreSQL
- **ORM**: Prisma 7.10.1
- **Language**: TypeScript

## Struktur Database

### Employee (Karyawan)
- Data pribadi: nama, email, telepon, alamat, tanggal lahir, jenis kelamin
- Data pekerjaan: kode karyawan, departemen, posisi, status kepegawaian, tanggal bergabung
- Relasi: Department, Position, Payroll, Performance

### Department (Departemen)
- Nama departemen
- Relasi: Employee

### Position (Posisi/Jabatan)
- Nama posisi
- Relasi: Employee

### Payroll (Penggajian)
- Periode gaji
- Komponen: gaji pokok, tunjangan, bonus, potongan
- Gaji bersih (net salary)
- Relasi: Employee

### Performance (Kinerja)
- Periode evaluasi
- Skor kinerja
- Catatan
- Relasi: Employee

## Setup Projek

### Prasyarat
- Node.js (versi 20 atau lebih baru)
- PostgreSQL
- npm atau yarn

### Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd dasbor-karyawan
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
Buat file `.env` di root folder dengan konfigurasi:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dasbor_karyawan"
```

4. Setup database:
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev

# (Opsional) Seed data awal
npm run seed
```

5. Jalankan development server:
```bash
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000)

## Commands

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build aplikasi untuk production
npm run start        # Jalankan production server

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Buat dan jalankan migrasi
npx prisma studio    # Buka Prisma Studio (database GUI)
npm run seed         # Seed data awal (jika tersedia)
```

## Struktur Folder

```
dasbor-karyawan/
├── prisma/
│   ├── schema.prisma       # Schema database
│   └── seed.ts             # Script seed data
├── src/
│   ├── app/
│   │   ├── api/            # API Routes
│   │   │   ├── departemen/
│   │   │   ├── karyawan/
│   │   │   ├── payroll/
│   │   │   ├── performance/
│   │   │   └── posisi/
│   │   ├── karyawan/       # Halaman karyawan
│   │   │   └── [id]/       # Detail karyawan
│   │   ├── payroll/        # Halaman payroll
│   │   ├── performance/    # Halaman performance
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Dashboard (homepage)
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── karyawan/       # Komponen karyawan
│   │   ├── payroll/        # Komponen payroll
│   │   ├── performance/    # Komponen performance
│   │   ├── sidebar/        # Komponen sidebar navigasi
│   │   ├── ui/             # UI components (shadcn)
│   │   └── DashboardCharts.tsx
│   ├── generated/
│   │   └── prisma/         # Generated Prisma Client
│   └── lib/
│       ├── prismaClient.ts # Prisma client instance
│       └── utils.ts        # Utility functions
├── package.json
└── README.md
```

## Fitur API

### Karyawan
- `GET /api/karyawan` - List semua karyawan
- `POST /api/karyawan` - Tambah karyawan baru
- `GET /api/karyawan/[id]` - Detail karyawan
- `PUT /api/karyawan/[id]` - Update karyawan
- `DELETE /api/karyawan/[id]` - Hapus karyawan

### Payroll
- `GET /api/payroll` - List semua payroll
- `POST /api/payroll` - Tambah payroll baru
- `GET /api/payroll/[id]` - Detail payroll
- `PUT /api/payroll/[id]` - Update payroll
- `DELETE /api/payroll/[id]` - Hapus payroll

### Performance
- `GET /api/performance` - List semua performance
- `POST /api/performance` - Tambah performance baru
- `GET /api/performance/[id]` - Detail performance
- `PUT /api/performance/[id]` - Update performance
- `DELETE /api/performance/[id]` - Hapus performance

### Departemen
- `GET /api/departemen` - List semua departemen
- `POST /api/departemen` - Tambah departemen baru

### Posisi
- `GET /api/posisi` - List semua posisi
- `POST /api/posisi` - Tambah posisi baru

## Lisensi

Private

