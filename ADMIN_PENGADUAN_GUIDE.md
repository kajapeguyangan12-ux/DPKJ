# 📢 Admin Panel Pengaduan Masyarakat

## ✨ Fitur yang Dibuat

### **Halaman Admin Pengaduan**
File: `src/app/admin/pengaduan/page.tsx`

Panel admin modern dan profesional untuk mengelola pengaduan dari masyarakat dengan styling yang konsisten dengan modul lainnya.

---

## 🎨 Design & Styling

### **Modern Professional Design**
- ✅ Gradient header (orange-red-pink)
- ✅ Statistics cards dengan icons
- ✅ Advanced search & filter system
- ✅ Modern card layout dengan hover effects
- ✅ Responsive modal dialogs
- ✅ Smooth animations & transitions

### **Color Scheme**
```css
Header: from-orange-600 via-red-600 to-pink-600
Menunggu: from-yellow-500 to-amber-500
Diproses: from-blue-500 to-indigo-500  
Disetujui: from-green-500 to-emerald-500
Selesai: from-green-600 to-teal-600
Ditolak: from-red-500 to-rose-500
```

---

## 📊 Fitur Utama

### **1. Statistics Dashboard**
```typescript
- Total Pengaduan
- Menunggu (⏳)
- Diproses (🔄)
- Selesai (✔️)
- Ditolak (❌)
```

Setiap card menampilkan:
- Jumlah pengaduan per status
- Icon yang sesuai
- Gradient background
- Hover effect dengan scale

### **2. Search & Filter System**

**Search Bar:**
- Pencarian berdasarkan judul pengaduan
- Pencarian berdasarkan nama pelapor
- Pencarian berdasarkan kategori
- Clear button jika ada search query
- Real-time filtering

**Filter Tabs:**
```typescript
- Semua
- Menunggu
- Diproses
- Disetujui
- Selesai
- Ditolak
```

**Sort Options:**
- 🕐 Terbaru (newest first)
- 🕑 Terlama (oldest first)

### **3. Pengaduan Card Display**

Setiap card menampilkan:

**Visual:**
- Foto pengaduan (jika ada)
- Badge jumlah foto (+X foto)
- Placeholder jika tidak ada foto

**Informasi:**
- Judul pengaduan (hover color change)
- Kategori (badge dengan icon)
- Status (badge dengan emoji)
- Deskripsi singkat (line-clamp-2)

**Info Grid (4 items):**
1. **Pelapor** - Nama lengkap
2. **Telepon** - Nomor telepon
3. **Alamat** - Alamat pelapor
4. **Tanggal** - Tanggal laporan

**Action Buttons:**
- **Detail** (blue gradient) - Lihat detail lengkap
- **Ubah Status** (orange-red gradient) - Update status

### **4. Detail Modal**

**Header:**
- Gradient orange-red-pink
- Icon megaphone
- Close button

**Content Sections:**

1. **Status Badge**
   - Large status badge dengan emoji
   - Gradient sesuai status

2. **Title & Category**
   - Judul pengaduan (large, bold)
   - Kategori badge

3. **Foto Pengaduan** (jika ada)
   - Grid 3 kolom
   - Aspect square
   - Clickable (open in new tab)
   - Hover scale effect

4. **Isi Pengaduan**
   - Full text dengan background gray-50
   - Icon deskripsi

5. **Informasi Pelapor**
   - Grid 2 kolom
   - Nama, NIK, Telepon, Email
   - Alamat (col-span-2)

6. **Catatan Admin** (jika ada)
   - Blue background
   - Border blue-200
   - Icon note

7. **Alasan Penolakan** (jika ditolak)
   - Red background
   - Border red-200
   - Warning icon

8. **Timestamps**
   - Tanggal laporan
   - Terakhir diupdate

**Footer Actions:**
- Button "Tutup"
- Button "Ubah Status"

### **5. Status Update Modal**

**Header:**
- Gradient orange-red-pink
- Edit icon
- Close button

**Content:**

1. **Current Info Card**
   - Judul pengaduan
   - Nama pelapor

2. **Status Selection**
   - Grid 2 kolom
   - 5 status options
   - Setiap button dengan:
     - Emoji icon
     - Label status
     - Background sesuai status
     - Active state dengan gradient

3. **Catatan Admin**
   - Textarea untuk catatan
   - Optional field
   - Rounded border

4. **Alasan Penolakan** (conditional)
   - Muncul HANYA jika status = "ditolak"
   - Required field
   - Red border
   - Placeholder yang jelas

**Footer Actions:**
- Button "Batal"
- Button "Simpan Perubahan" dengan loading state

---

## 🔧 Technical Implementation

### **Service Integration**

**Functions Used:**
```typescript
import {
  getAllLaporan,           // Get all pengaduan
  updateLaporanStatus,     // Update status pengaduan
  LaporanMasyarakat        // TypeScript interface
} from '../../../lib/laporanService';
```

### **Interface:**
```typescript
interface LaporanMasyarakat {
  id?: string;
  judulLaporan: string;
  kategoriLaporan: string;
  isiLaporan: string;
  namaLengkap: string;
  nik: string;
  alamat: string;
  noTelepon: string;
  email?: string;
  fotoLaporan?: string[];
  status: 'menunggu' | 'diproses' | 'disetujui' | 'ditolak' | 'selesai';
  alasanTolak?: string;
  catatanAdmin?: string;
  tanggalLaporan: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  processedBy?: string;
  processedAt?: Timestamp;
  userId: string;
}
```

### **State Management:**
```typescript
// Data states
const [laporanList, setLaporanList] = useState<LaporanMasyarakat[]>([]);
const [loading, setLoading] = useState(true);

// Filter & search
const [searchQuery, setSearchQuery] = useState('');
const [activeFilter, setActiveFilter] = useState<FilterType>('all');
const [sortBy, setSortBy] = useState<SortType>('newest');

// Modal states
const [showDetailModal, setShowDetailModal] = useState(false);
const [showStatusModal, setShowStatusModal] = useState(false);
const [selectedLaporan, setSelectedLaporan] = useState<LaporanMasyarakat | null>(null);

// Form states
const [newStatus, setNewStatus] = useState<string>('');
const [catatanAdmin, setCatatanAdmin] = useState('');
const [alasanTolak, setAlasanTolak] = useState('');
const [submitting, setSubmitting] = useState(false);
```

### **Data Flow:**

1. **Fetch Data:**
```typescript
const fetchLaporan = async () => {
  const data = await getAllLaporan();
  setLaporanList(data);
};
```

2. **Filter & Sort:**
```typescript
const filteredLaporan = laporanList
  .filter(item => {
    const matchesSearch = // search logic
    const matchesFilter = // filter logic
    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    // sort logic
  });
```

3. **Update Status:**
```typescript
const handleUpdateStatus = async () => {
  await updateLaporanStatus(selectedLaporan.id, {
    status: newStatus,
    catatanAdmin: catatanAdmin,
    alasanTolak: alasanTolak
  });
  
  // Refresh data
  await fetchLaporan();
  
  // Close modals
  setShowStatusModal(false);
  setShowDetailModal(false);
};
```

### **Notifications:**
Setiap update status otomatis membuat notifikasi untuk user:
```typescript
// Service akan otomatis create notification
{
  userId: laporan.userId,
  laporanId: id,
  title: notifTitle,
  message: notifMessage,
  type: notifType,
  status: status,
  isRead: false,
  createdAt: serverTimestamp()
}
```

---

## 📝 Service Update

### **File: `src/lib/laporanService.ts`**

**Fungsi Baru:**
```typescript
export const updateLaporanStatus = async (
  id: string, 
  updateData: {
    status: LaporanMasyarakat['status'];
    catatanAdmin?: string;
    alasanTolak?: string;
  }
) => {
  // Update status di Firestore
  // Create notification untuk user
}
```

**Notification Logic:**
- `menunggu` → tidak ada notif
- `diproses` → Notif info (blue)
- `disetujui` → Notif success (green)
- `selesai` → Notif success (green)
- `ditolak` → Notif error (red) + alasan

---

## 🎯 User Experience Features

### **1. Loading States**
- Spinner saat fetch data
- "Menyimpan..." saat submit
- Disabled buttons saat loading

### **2. Empty States**
- No data: Icon + message
- No search results: Icon + message + reset button

### **3. Validation**
- Status required
- Alasan tolak required jika status = ditolak
- Disable submit jika validation gagal

### **4. Visual Feedback**
- Hover effects pada cards
- Scale animation pada buttons
- Color transitions
- Shadow effects

### **5. Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly

---

## 📱 Responsive Design

**Grid Layout:**
- Statistics: 5 columns
- Info grid: 2 columns
- Status selection: 2 columns
- Photo gallery: 3 columns

**Mobile Optimization:**
- Full width pada mobile
- Touch-friendly buttons
- Readable text sizes
- Proper spacing

---

## 🚀 Workflow

### **Siklus Pengaduan:**

1. **Masyarakat membuat pengaduan** → Status: Menunggu
2. **Admin review** → Update ke: Diproses
3. **Admin action:**
   - ✅ Setujui → Status: Disetujui/Selesai
   - ❌ Tolak → Status: Ditolak (+ alasan)
4. **User menerima notifikasi**

### **Admin Actions:**

**Dari List:**
- Click "Detail" → Lihat full information
- Click "Ubah Status" → Quick status update

**Dari Detail Modal:**
- View all info
- Click "Ubah Status" → Update status
- Click "Tutup" → Close modal

**Status Update:**
- Select new status
- Add admin notes (optional)
- Add rejection reason (required for ditolak)
- Click "Simpan Perubahan"
- Auto refresh list
- Auto close modals
- Show success alert

---

## ✅ Checklist Testing

- [x] Fetch all pengaduan from Firestore
- [x] Display statistics correctly
- [x] Search functionality
- [x] Filter by status
- [x] Sort by date
- [x] Open detail modal
- [x] Display all laporan info
- [x] Display photos in grid
- [x] Open status update modal
- [x] Select new status
- [x] Add catatan admin
- [x] Add alasan tolak (for ditolak)
- [x] Validation (require alasan if ditolak)
- [x] Update status in Firestore
- [x] Create notification for user
- [x] Refresh data after update
- [x] Close modals after success
- [x] Loading states
- [x] Empty states
- [x] Error handling

---

## 🎨 Styling Consistency

**Synchronized dengan modul lain:**
- ✅ Same gradient patterns
- ✅ Same border radius (rounded-2xl, rounded-3xl)
- ✅ Same shadow effects
- ✅ Same animation duration
- ✅ Same hover effects
- ✅ Same modal design
- ✅ Same button styles

**Design System:**
- Padding: p-4, p-6, p-8
- Gaps: gap-2, gap-3, gap-4, gap-6
- Shadows: shadow-lg, shadow-xl, shadow-2xl
- Transitions: transition-all duration-300
- Hover: hover:scale-105, hover:shadow-xl

---

## 📊 Statistics

**Data yang ditampilkan:**
```typescript
{
  total: Total semua pengaduan,
  menunggu: Jumlah status menunggu,
  diproses: Jumlah status diproses,
  selesai: Jumlah status selesai + disetujui,
  ditolak: Jumlah status ditolak
}
```

**Card Design:**
- Icon background dengan gradient
- Large number (text-3xl)
- Label dengan color yang sesuai
- Hover effect dengan scale

---

## 🔔 Notification System

**Auto-generated saat update status:**

| Status | Notification Type | Color | Message |
|--------|------------------|-------|---------|
| Menunggu | - | - | No notification |
| Diproses | Info | Blue | "Laporan sedang ditinjau" |
| Disetujui | Success | Green | "Laporan telah disetujui" |
| Selesai | Success | Green | "Laporan telah selesai" |
| Ditolak | Error | Red | "Laporan ditolak + alasan" |

---

## 💡 Best Practices Applied

1. **TypeScript** - Full type safety
2. **Component Separation** - Reusable patterns
3. **Error Handling** - Try-catch blocks
4. **Loading States** - User feedback
5. **Optimistic Updates** - Fast UI response
6. **Responsive Design** - Mobile-first
7. **Accessibility** - ARIA labels
8. **Performance** - Efficient re-renders
9. **Code Organization** - Clean structure
10. **Documentation** - Clear comments

---

**Status**: ✅ Completed & Production Ready
**Last Updated**: 2025-11-01
**Version**: 1.0.0
