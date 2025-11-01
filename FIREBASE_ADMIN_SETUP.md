# 🔥 Firebase Admin SDK Setup Guide

## 📋 Langkah-langkah Setup

### 1. Generate Service Account Key

1. **Buka Firebase Console**
   - Kunjungi: https://console.firebase.google.com
   - Pilih project: `dpkj-ffc01`

2. **Masuk ke Project Settings**
   - Klik ikon ⚙️ di sidebar kiri
   - Pilih "Project settings"

3. **Generate Service Account**
   - Klik tab "Service accounts"
   - Klik "Generate new private key"
   - Download file JSON (contoh: `dpkj-ffc01-firebase-adminsdk-xxxxx.json`)

### 2. Konfigurasi Environment Variables

Ada 2 cara untuk konfigurasi:

#### **Cara A: Menggunakan File JSON (Recommended)**

1. Simpan file service account di lokasi aman, misalnya:
   ```
   C:\secrets\firebase-service-account.json
   ```

2. Update `.env.local`:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=C:\secrets\firebase-service-account.json
   FIREBASE_PROJECT_ID=dpkj-ffc01
   ```

#### **Cara B: Individual Fields**

1. Buka file JSON yang didownload
2. Extract field-field berikut ke `.env.local`:

```bash
FIREBASE_PROJECT_ID=dpkj-ffc01
FIREBASE_PRIVATE_KEY_ID="isi_dari_private_key_id_di_json"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nisi_dari_private_key_di_json\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@dpkj-ffc01.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="isi_dari_client_id_di_json"
```

### 3. Testing Setup

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test upload functionality**:
   - Buka admin dashboard: http://localhost:3000/admin/data-desa
   - Klik tombol "Upload Excel"
   - Coba upload file Excel

3. **Check console untuk error**:
   - Buka browser developer tools
   - Lihat console untuk pesan error Firebase

### 4. Firestore Rules (Opsional)

Jika ada masalah permission, update Firestore rules di Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin SDK full access
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Troubleshooting

#### **Error: "Invalid PEM formatted message"**
- Pastikan FIREBASE_PRIVATE_KEY berisi full private key dengan `\n`
- Contoh format yang benar:
  ```
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...\n-----END PRIVATE KEY-----\n"
  ```

#### **Error: "Failed to initialize Firebase Admin"**
- Check apakah semua environment variables sudah diisi
- Pastikan service account file path benar (jika menggunakan Cara A)
- Restart development server setelah update .env.local

#### **Error: "Permission denied"**
- Pastikan service account memiliki role "Firebase Admin SDK Admin Service Agent"
- Check Firestore rules jika perlu

### 6. Production Deployment

Untuk production (Vercel, Netlify, dll):

1. **Upload service account sebagai environment variables**
2. **Atau gunakan provider-specific secrets management**
3. **Pastikan FIREBASE_PROJECT_ID = dpkj-ffc01**

## 🎯 Config yang Sudah Tersedia

Berdasarkan Firebase config yang Anda berikan:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDiwZyH9yQvJvjW4otawrNrwwbEYfMQ1vI",
  authDomain: "dpkj-ffc01.firebaseapp.com", 
  projectId: "dpkj-ffc01", // ← Project ID sudah benar
  storageBucket: "dpkj-ffc01.firebasestorage.app",
  messagingSenderId: "528333091299",
  appId: "1:528333091299:web:124c5d67f0c70a51a0b0d6"
};
```

Project ID: `dpkj-ffc01` sudah dikonfigurasi dengan benar di sistem.

## ✅ Verification

Setelah setup, sistem upload Excel akan:
1. ✅ Membaca file .xlsx
2. ✅ Parse data dalam batch 500 records  
3. ✅ Upload ke Firestore collection `dataWarga`
4. ✅ Menampilkan progress real-time
5. ✅ Update statistik dashboard

**Happy uploading! 🚀**