# FIRESTORE INDEX FIX GUIDE

## Error yang Terjadi
```
FirebaseError: The query requires an index. You can create it here: 
https://console.firebase.google.com/v1/r/project/dpkj-ffc01/firestore/indexes?create_composite=...
```

## Penyebab
Error ini terjadi karena Firestore membutuhkan composite index untuk query kompleks yang menggunakan multiple `where` clauses dan `orderBy`.

## Solusi yang Telah Diterapkan

### 1. Simplifikasi Query di userManagementService.ts
Mengubah query kompleks menjadi query sederhana dan melakukan filtering/sorting di client-side:

**Sebelum:**
```typescript
// Query kompleks yang membutuhkan composite index
q = query(
  this.usersCollection,
  where('role', '==', role),
  where('status', '!=', 'deleted'),
  orderBy('status'),
  orderBy('displayName')
);
```

**Sesudah:**
```typescript
// Query sederhana
q = query(
  this.usersCollection,
  where('role', '==', role)
);

// Filter dan sort di client-side
const users = snapshot.docs
  .filter(doc => doc.data().status !== 'deleted')
  .sort((a, b) => {
    // Custom sorting logic
  });
```

### 2. Update Firestore Rules
Menambahkan rules yang sesuai untuk RBAC system baru di `firestore.rules`.

## Cara Membuat Index Jika Diperlukan (Optional)

Jika di masa depan ingin menggunakan query kompleks untuk performa yang lebih baik:

### 1. Akses Firebase Console
- Buka: https://console.firebase.google.com/
- Pilih project: `dpkj-ffc01`
- Navigate ke: Firestore Database > Indexes

### 2. Buat Composite Index untuk Users Collection
Collection ID: `users`

Fields yang diperlukan:
```
1. role (Ascending)
2. status (Ascending)  
3. displayName (Ascending)
4. __name__ (Ascending)
```

### 3. Index Configuration JSON
```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "role",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status", 
          "order": "ASCENDING"
        },
        {
          "fieldPath": "displayName",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
```

### 4. Menggunakan Firebase CLI (Alternative)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Deploy indexes
firebase deploy --only firestore:indexes
```

## Performance Considerations

### Client-side Filtering vs Server-side Query
- **Client-side** (Current): Lebih mudah setup, tidak perlu index, tapi transfer data lebih besar
- **Server-side** (Dengan index): Performa lebih baik, transfer data minimal, tapi perlu setup index

### Kapan Menggunakan Server-side Query
- Collection users memiliki > 1000 documents
- Aplikasi memiliki traffic tinggi
- Ingin mengoptimalkan bandwidth

### Kapan Client-side Filtering Sudah Cukup
- Collection users < 500 documents
- Development/testing phase
- Setup yang lebih mudah

## Monitoring Index Usage

### 1. Firebase Console
- Navigate ke: Firestore > Usage tab
- Monitor query performance dan costs

### 2. Query Performance
```typescript
// Add performance monitoring
const startTime = performance.now();
const users = await getUsersByRole(role);
const endTime = performance.now();
console.log(`Query took ${endTime - startTime} milliseconds`);
```

## Troubleshooting

### 1. Index Masih Error
- Tunggu 5-10 menit setelah membuat index
- Clear cache browser dan restart application
- Periksa apakah field names exact match

### 2. Query Limit Exceeded
- Firestore memiliki limit 1MB per query
- Implement pagination jika data terlalu besar

### 3. Rules Blocking Access
- Periksa Firestore rules di console
- Test rules dengan Firebase Rules Playground

## Rekomendasi

Untuk development saat ini, solusi client-side filtering sudah cukup karena:
1. Mudah di-maintain
2. Tidak perlu setup index kompleks  
3. Jumlah users masih relatif kecil
4. Error sudah teratasi

Jika di masa depan perlu optimasi performa, bisa membuat composite index sesuai panduan di atas.

## Test Command
Setelah fix, test dengan:
```bash
npm run build
npm run dev
```

Lalu akses halaman kelola pengguna untuk memastikan error sudah hilang.