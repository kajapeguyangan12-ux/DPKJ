"use client";

import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

export default function SejarahDesaPage() {
  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
        />

        {/* Foto Sejarah Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Foto Sejarah Desa
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-16 text-center shadow-inner">
              <span className="text-6xl">📚</span>
            </div>
          </div>
        </section>

        {/* Detail Sejarah Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Detail Sejarah Desa
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 shadow-inner">
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  Desa Peguyangan Kaja memiliki sejarah yang panjang dan kaya akan nilai-nilai
                  budaya Bali. Desa ini diperkirakan sudah ada sejak zaman kerajaan Bali kuno,
                  sekitar abad XIV Masehi.
                </p>

                <p>
                  <strong>Asal-usul nama "Peguyangan Kaja":</strong><br/>
                  Kata "Peguyangan" berasal dari bahasa Bali yang berarti "hutan kecil" atau
                  "tempat yang teduh", sedangkan "Kaja" berarti "utara". Sehingga Peguyangan
                  Kaja dapat diartikan sebagai "hutan kecil di utara".
                </p>

                <p>
                  <strong>Perkembangan Historis:</strong><br/>
                  Pada masa kolonial Belanda, Desa Peguyangan Kaja menjadi salah satu desa
                  yang aktif dalam pergerakan kemerdekaan. Banyak tokoh-tokoh masyarakat
                  yang terlibat dalam organisasi perjuangan melawan penjajahan.
                </p>

                <p>
                  <strong>Pascakemerdekaan:</strong><br/>
                  Setelah Indonesia merdeka, Desa Peguyangan Kaja mengalami perkembangan
                  yang pesat. Pada tahun 1970-an, desa ini mulai berkembang menjadi daerah
                  wisata dengan berbagai atraksi budaya yang menjadi daya tarik wisatawan
                  domestik maupun mancanegara.
                </p>

                <p>
                  <strong>Era Modern:</strong><br/>
                  Memasuki era digital, Desa Peguyangan Kaja terus beradaptasi dengan
                  perkembangan teknologi. Pemerintah desa aktif mengembangkan sistem
                  informasi desa digital untuk meningkatkan pelayanan kepada masyarakat
                  dan melestarikan nilai-nilai budaya lokal.
                </p>

                <p>
                  <strong>Peninggalan Sejarah:</strong><br/>
                  Desa ini memiliki beberapa situs bersejarah seperti Pura Peguyangan,
                  Pasar Seni Tradisional, dan beberapa rumah adat Bali yang masih
                  lestari hingga saat ini.
                </p>

                <p>
                  Hingga saat ini, Desa Peguyangan Kaja tetap mempertahankan identitasnya
                  sebagai desa yang kaya akan nilai-nilai budaya, seni, dan tradisi Bali
                  sambil terus berkembang mengikuti perkembangan zaman modern.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
