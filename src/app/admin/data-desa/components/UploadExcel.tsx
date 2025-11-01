"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface UploadExcelProps {
  onUploadComplete?: () => void;
}

const UploadExcel: React.FC<UploadExcelProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    processed: 0,
    errors: 0,
    families: 0 // Jumlah keluarga
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.includes('sheet')) {
      setFile(selectedFile);
      
      // Baca dan preview data
      try {
        const data = await readExcelFile(selectedFile);
        
        // Validasi format KK
        const hasRequiredFields = data.length > 0 && 
          data.some(row => row.noKK && row.namaLengkap && row.nik);
          
        if (!hasRequiredFields) {
          alert('Format Excel tidak sesuai. Pastikan ada kolom: No KK, Nama Lengkap, dan NIK');
          event.target.value = '';
          return;
        }
        
        // Group by No KK untuk statistik keluarga
        const families = [...new Set(data.map(row => row.noKK).filter(kk => kk))];
        
        setPreviewData(data.slice(0, 10)); // Preview 10 record pertama
        setUploadStats(prev => ({
          ...prev,
          total: data.length,
          families: families.length
        }));
        setShowPreview(true);
        
      } catch (error) {
        alert('Gagal membaca file Excel. Pastikan format file benar.');
        event.target.value = '';
      }
    } else {
      alert('Harap pilih file Excel (.xlsx atau .xls)');
      event.target.value = '';
    }
  };

  const readExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Parse format KK khusus dari attachment
          const parsedData = parseKKFormat(jsonData);
          
          if (parsedData.length > 0) {
            resolve(parsedData);
            return;
          }

          // Fallback ke format standar
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const formattedData = rows.map((row: any[]) => {
            const obj: any = {};
            headers.forEach((header: string, index: number) => {
              // Map Excel column names to our database fields (format KK standar)
              const fieldMapping: { [key: string]: string } = {
                // Format standar Kartu Keluarga
                'No KK': 'noKK',
                'Nomor KK': 'noKK',
                'No. KK': 'noKK',
                'NIK': 'nik',
                'Nama Lengkap': 'namaLengkap',
                'Nama': 'namaLengkap',
                'Alamat': 'alamat',
                'Tanggal Lahir': 'tanggalLahir',
                'Tgl Lahir': 'tanggalLahir',
                'Jenis Kelamin': 'jenisKelamin',
                'JK': 'jenisKelamin',
                'SHDK': 'shdk',
                'Status Hubungan Dalam Keluarga': 'shdk',
                'Pendidikan': 'pendidikan',
                'Pendidikan Terakhir': 'pendidikan',
                'Pekerjaan': 'pekerjaan',
                
                // Field tambahan
                'Tempat Lahir': 'tempatLahir',
                'Agama': 'agama',
                'Status Perkawinan': 'statusPerkawinan',
                'Status Nikah': 'statusPerkawinan',
                'Kewarganegaraan': 'kewarganegaraan',
                'RT': 'rt',
                'RW': 'rw',
                'Dusun': 'dusun',
                'Desa': 'desa',
                'Kecamatan': 'kecamatan',
                'Kabupaten': 'kabupaten',
                'Provinsi': 'provinsi',
                'Golongan Darah': 'golonganDarah',
                'Ayah': 'namaAyah',
                'Ibu': 'namaIbu',
              };

              const fieldName = fieldMapping[header] || header.toLowerCase().replace(/\s/g, '');
              obj[fieldName] = row[index] || '';
            });
            return obj;
          });

          // Filter dan format data
          const validData = formattedData.filter(item => {
            return item.namaLengkap && item.nik && item.noKK; // Harus ada nama, NIK, dan No KK
          }).map(item => ({
            ...item,
            // Pastikan format tanggal seragam
            tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir).toISOString().split('T')[0] : '',
            // Normalisasi jenis kelamin
            jenisKelamin: item.jenisKelamin?.toLowerCase().includes('laki') ? 'Laki-laki' : 
                         item.jenisKelamin?.toLowerCase().includes('perempuan') ? 'Perempuan' : 
                         item.jenisKelamin || '',
            // Tambahkan timestamp
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          
          resolve(validData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const uploadBatch = async (batch: any[], batchNumber: number) => {
    try {
      const response = await fetch('/api/uploadBatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch,
          batchNumber,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Gagal upload batch');
      }

      return result;
    } catch (error) {
      console.error(`Error uploading batch ${batchNumber}:`, error);
      throw error;
    }
  };

  // Parser khusus untuk format KK dari attachment
  const parseKKFormat = (jsonData: any[]): any[] => {
    const result: any[] = [];
    let currentNoKK = '';
    let currentAlamat = '';
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      // Cek baris No KK dan Alamat
      if (row[0] && row[0].toString().includes('No. KK :')) {
        currentNoKK = row[0].toString().replace('No. KK :', '').trim();
        continue;
      }
      
      if (row[1] && row[1].toString().includes('Alamat :')) {
        currentAlamat = row[1].toString().replace('Alamat :', '').trim();
        continue;
      }
      
      // Skip header rows
      if (row[0] === 'Nama Lengkap' || row[0] === '-2' || !row[0]) {
        continue;
      }
      
      // Parse data anggota keluarga
      if (currentNoKK && row[0] && row[1]) { // Pastikan ada nama dan NIK
        const person = {
          noKK: currentNoKK,
          namaLengkap: row[0]?.toString().trim() || '',
          nik: row[1]?.toString().trim() || '',
          tempatLahir: row[2]?.toString().trim() || '',
          tanggalLahir: row[3] ? formatDate(row[3]) : '',
          jenisKelamin: normalizeGender(row[4]?.toString().trim() || ''),
          shdk: row[5]?.toString().trim() || '',
          agama: row[6]?.toString().trim() || '',
          pendidikan: row[7]?.toString().trim() || '',
          pekerjaan: row[8]?.toString().trim() || '',
          alamat: currentAlamat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Filter hanya data yang valid
        if (person.namaLengkap && person.nik && person.noKK) {
          result.push(person);
        }
      }
    }
    
    return result;
  };

  // Helper functions
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    try {
      // Handle various date formats
      if (typeof dateValue === 'number') {
        // Excel serial date
        const date = new Date((dateValue - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? dateValue : date.toISOString().split('T')[0];
      }
      return dateValue.toString();
    } catch {
      return dateValue.toString();
    }
  };

  const normalizeGender = (gender: string): string => {
    const g = gender.toLowerCase();
    if (g.includes('laki') || g === 'l' || g === 'lk') return 'Laki-laki';
    if (g.includes('perempuan') || g === 'p' || g === 'pr') return 'Perempuan';
    return gender;
  };

  const downloadTemplate = () => {
    // Template data KK
    const templateData = [
      ['No KK', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'SHDK', 'Tanggal Lahir', 'Alamat', 'Pendidikan', 'Pekerjaan', 'RT', 'RW', 'Tempat Lahir', 'Agama', 'Status Perkawinan'],
      ['1234567890123456', '1234567890123456', 'Budi Santoso', 'Laki-laki', 'Kepala Keluarga', '1980-05-15', 'Jl. Merdeka No. 123', 'S1', 'PNS', '01', '02', 'Jakarta', 'Islam', 'Kawin'],
      ['1234567890123456', '2345678901234567', 'Siti Rahayu', 'Perempuan', 'Istri', '1985-08-20', 'Jl. Merdeka No. 123', 'SMA', 'Ibu Rumah Tangga', '01', '02', 'Bandung', 'Islam', 'Kawin'],
      ['1234567890123456', '3456789012345678', 'Ahmad Santoso', 'Laki-laki', 'Anak', '2010-12-10', 'Jl. Merdeka No. 123', 'SD', 'Pelajar', '01', '02', 'Jakarta', 'Islam', 'Belum Kawin'],
      ['2345678901234567', '4567890123456789', 'Joko Widodo', 'Laki-laki', 'Kepala Keluarga', '1975-03-25', 'Jl. Proklamasi No. 45', 'S2', 'Wiraswasta', '03', '02', 'Surabaya', 'Islam', 'Kawin']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template KK');
    
    // Set column widths
    ws['!cols'] = [
      { width: 20 }, // No KK
      { width: 20 }, // NIK  
      { width: 25 }, // Nama Lengkap
      { width: 15 }, // Jenis Kelamin
      { width: 20 }, // SHDK
      { width: 15 }, // Tanggal Lahir
      { width: 30 }, // Alamat
      { width: 15 }, // Pendidikan
      { width: 20 }, // Pekerjaan
      { width: 5 },  // RT
      { width: 5 },  // RW
      { width: 15 }, // Tempat Lahir
      { width: 10 }, // Agama
      { width: 15 }  // Status Perkawinan
    ];
    
    XLSX.writeFile(wb, 'Template_Data_KK.xlsx');
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Harap pilih file Excel terlebih dahulu');
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadStats(prev => ({ ...prev, processed: 0, errors: 0 }));

    try {
      // Read Excel file
      const data = await readExcelFile(file);
      
      if (data.length === 0) {
        alert('File Excel tidak memiliki data yang valid');
        return;
      }

      const batchSize = 500;
      const totalBatches = Math.ceil(data.length / batchSize);
      
      setUploadStats(prev => ({ ...prev, total: data.length }));

      let processedCount = 0;
      let errorCount = 0;

      // Process batches
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, data.length);
        const batch = data.slice(start, end);

        try {
          const result = await uploadBatch(batch, i + 1);
          processedCount += result.processedCount || batch.length;
          
          // Update progress
          const progressPercent = ((i + 1) / totalBatches) * 100;
          setProgress(progressPercent);
          setUploadStats(prev => ({
            ...prev,
            processed: processedCount,
            errors: errorCount
          }));

        } catch (error) {
          errorCount += batch.length;
          setUploadStats(prev => ({
            ...prev,
            errors: prev.errors + batch.length
          }));
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      alert(`Upload selesai!\nBerhasil: ${processedCount} data\nGagal: ${errorCount} data`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Reset form
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat upload: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setProgress(0);
      setShowPreview(false);
      setPreviewData([]);
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Data Excel</h3>
      
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Pilih File Excel
            </label>
            <button
              onClick={downloadTemplate}
              className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              📥 Download Template
            </button>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {file && (
            <p className="mt-2 text-sm text-green-600">
              File dipilih: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Upload Stats */}
        {uploadStats.total > 0 && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{uploadStats.total}</div>
              <div className="text-xs text-gray-600">Total Data</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{uploadStats.families}</div>
              <div className="text-xs text-gray-600">Keluarga</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{uploadStats.processed}</div>
              <div className="text-xs text-gray-600">Berhasil</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{uploadStats.errors}</div>
              <div className="text-xs text-gray-600">Gagal</div>
            </div>
          </div>
        )}

        {/* Preview Data KK */}
        {showPreview && previewData.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-medium text-gray-900">Preview Data ({previewData.length} dari {uploadStats.total} record)</h4>
              <p className="text-sm text-gray-600">Format Kartu Keluarga - {uploadStats.families} Keluarga Ditemukan</p>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No KK</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">JK</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SHDK</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tgl Lahir</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pendidikan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pekerjaan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.noKK || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.nik || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.namaLengkap || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.jenisKelamin || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.shdk || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.tanggalLahir || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.pendidikan || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {row.pekerjaan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-2 border-t">
              <p className="text-xs text-gray-500">
                Menampilkan preview 10 record pertama. Total {uploadStats.total} record siap diupload.
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress Upload</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {uploading ? 'Mengupload...' : 'Upload Data Excel'}
        </button>

        {/* Help Text */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">Format Excel Kartu Keluarga yang didukung:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700 mb-1">Kolom Wajib:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>No KK (Nomor Kartu Keluarga)</li>
                <li>NIK (Nomor Induk Kependudukan)</li>
                <li>Nama Lengkap</li>
                <li>Jenis Kelamin</li>
                <li>SHDK (Status Hubungan Dalam Keluarga)</li>
                <li>Tanggal Lahir</li>
                <li>Pendidikan</li>
                <li>Pekerjaan</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Kolom Opsional:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>Alamat, RT, RW</li>
                <li>Tempat Lahir, Agama</li>
                <li>Status Perkawinan</li>
                <li>Kewarganegaraan</li>
                <li>Nama Ayah, Nama Ibu</li>
                <li>Golongan Darah</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mt-3">
            <p className="text-xs text-blue-800">
              <span className="font-medium">💡 Tips:</span> Data akan dikelompokkan per keluarga berdasarkan No KK. 
              Pastikan setiap anggota keluarga memiliki No KK yang sama untuk satu keluarga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExcel;