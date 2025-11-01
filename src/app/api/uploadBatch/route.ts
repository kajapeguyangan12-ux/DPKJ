import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    // Check if we have service account file path
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Option A: Use service account file
      console.log('Initializing Firebase Admin with service account file');
      initializeApp({
        credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        projectId: process.env.FIREBASE_PROJECT_ID || "dpkj-ffc01",
      });
    } else if (process.env.FIREBASE_PROJECT_ID && 
               process.env.FIREBASE_PRIVATE_KEY && 
               process.env.FIREBASE_CLIENT_EMAIL) {
      // Option B: Use individual environment variables
      console.log('Initializing Firebase Admin with environment variables');
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
      } as any;

      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn('Firebase Admin credentials not configured. Upload functionality will be disabled.');
      console.warn('Please configure either GOOGLE_APPLICATION_CREDENTIALS or individual service account fields.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!getApps().length) {
      return NextResponse.json(
        { error: "Firebase Admin tidak terkonfigurasi. Silakan atur kredensial service account." },
        { status: 500 }
      );
    }

    const db = getFirestore();
    const { batch, batchNumber } = await request.json();

    if (!batch || !Array.isArray(batch)) {
      return NextResponse.json(
        { error: "Batch data harus berupa array" },
        { status: 400 }
      );
    }

    console.log(`Processing batch ${batchNumber} with ${batch.length} records`);

    // Process each record in the batch
    const batchRef = db.batch();
    let processedCount = 0;

    for (const record of batch) {
      try {
        // Validate required fields
        if (!record.namaLengkap || !record.nik) {
          console.log("Skipping invalid record:", record);
          continue;
        }

        // Create document reference
        const docRef = db.collection("data-desa").doc();
        
        // Prepare data with timestamps
        const dataToSave = {
          noKK: record.noKK || "",
          namaLengkap: record.namaLengkap || "",
          nik: record.nik || "",
          jenisKelamin: record.jenisKelamin || "",
          tempatLahir: record.tempatLahir || "",
          tanggalLahir: record.tanggalLahir || "",
          alamat: record.alamat || "",
          daerah: record.daerah || "",
          statusNikah: record.statusNikah || "",
          agama: record.agama || "",
          sukuBangsa: record.sukuBangsa || "",
          kewarganegaraan: record.kewarganegaraan || "",
          pendidikanTerakhir: record.pendidikanTerakhir || "",
          pekerjaan: record.pekerjaan || "",
          penghasilan: record.penghasilan || "",
          golonganDarah: record.golonganDarah || "",
          shdk: record.shdk || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        batchRef.set(docRef, dataToSave);
        processedCount++;
      } catch (recordError) {
        console.error("Error processing record:", recordError);
      }
    }

    // Commit the batch
    if (processedCount > 0) {
      await batchRef.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Batch ${batchNumber} berhasil diproses`,
      processedCount,
      totalInBatch: batch.length,
    });

  } catch (error) {
    console.error("Error in uploadBatch API:", error);
    return NextResponse.json(
      { 
        error: "Terjadi kesalahan saat menyimpan data", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}