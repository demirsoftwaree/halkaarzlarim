import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";

export const metadata = {
  title: "Kullanım Koşulları — Halkaarzlarım.com",
  description: "Halkaarzlarım.com kullanım koşulları — hizmeti kullanmadan önce lütfen okuyunuz.",
};

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <TickerBar />
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Kullanım Koşulları</h1>
            <p className="text-slate-500 text-sm">Son güncelleme: Mart 2026</p>
          </div>

          {/* İçerik */}
          <div className="space-y-8 text-slate-300 leading-relaxed">

            <p>
              <strong className="text-white">Halkaarzlarım.com</strong>'u ("sitemiz") kullanmadan önce lütfen bu kullanım koşullarını dikkatlice okuyunuz.
              Sitemizi ziyaret ederek veya hesap oluşturarak bu koşulları kabul etmiş sayılırsınız.
              Koşulları kabul etmiyorsanız sitemizi kullanmayınız.
            </p>

            <hr className="border-slate-700/60" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Hizmetin Kapsamı</h2>
              <p>
                Halkaarzlarım.com, Türkiye'deki halka arz yatırımcılarına yönelik bilgi ve araçlar sunan bir platformdur.
                Sitemizde sunulan içerikler; halka arz takvimi, tavan simülatörü, lot hesaplama, kâr hesaplama, haber akışı
                ve portföy takibi gibi özelliklerden oluşmaktadır.
              </p>
              <p className="mt-2">
                Sunulan tüm bilgiler yalnızca genel bilgilendirme amacı taşır. Sitemiz hiçbir şekilde yatırım danışmanlığı,
                aracılık veya portföy yönetimi hizmeti vermemektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Sorumluluk Reddi</h2>
              <p>
                Sitemizde yer alan veriler (fiyatlar, arz tarihleri, duyurular vb.) SPK, KAP, Yahoo Finance gibi üçüncü taraf
                kaynaklardan otomatik olarak alınmaktadır. Bu verilerin doğruluğu, eksiksizliği ve güncelliği konusunda
                herhangi bir garanti verilmemektedir.
              </p>
              <p className="mt-2">
                Kullanıcıların bu bilgilere dayanarak aldığı yatırım kararlarından doğabilecek maddi veya manevi zararlardan
                Halkaarzlarım.com sorumlu tutulamaz. Yatırım kararı almadan önce yetkili bir finansal danışmana başvurmanız tavsiye edilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Hesap Oluşturma ve Güvenlik</h2>
              <p>
                Sitemizde hesap oluşturmak için gerçek ve doğru bilgiler vermeniz gerekmektedir. Hesabınızın güvenliğinden
                siz sorumlusunuz; şifrenizi kimseyle paylaşmamalısınız.
              </p>
              <p className="mt-2">
                Hesabınızın yetkisiz kullanıldığını fark ettiğinizde derhal
                <a href="mailto:destek@halkaarzlarim.com" className="text-emerald-400 hover:underline mx-1">destek@halkaarzlarim.com</a>
                adresine bildiriniz. Hesabınızın kötüye kullanımından kaynaklanan zararlardan Halkaarzlarım.com sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Premium Üyelik</h2>
              <p>
                Premium üyelik, ek özelliklere (portföy takibi, geçmiş tavan performansı, reklamsız deneyim vb.) erişim sağlar.
                Premium abonelik ücretleri ve koşulları sitemizin
                <a href="/premium" className="text-emerald-400 hover:underline mx-1">Premium</a>
                sayfasında belirtilmektedir.
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
                <li>Abonelik ücretleri peşin tahsil edilir; iade yapılmaz.</li>
                <li>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz; iptali takip eden dönemde yenileme yapılmaz.</li>
                <li>Fiyatlar önceden duyurulmak kaydıyla değiştirilebilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Yasaklı Kullanımlar</h2>
              <p>Sitemizi aşağıdaki amaçlarla kullanamazsınız:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
                <li>Yanıltıcı, yasa dışı veya zararlı içerik yayma</li>
                <li>Otomatik botlar veya kazıyıcılar (scraper) aracılığıyla veri toplama</li>
                <li>Siteye zarar verecek biçimde aşırı istek gönderme (DoS/DDoS)</li>
                <li>Başkalarının hesaplarına yetkisiz erişim sağlama</li>
                <li>Telif hakkıyla korunan içerikleri izinsiz dağıtma</li>
              </ul>
              <p className="mt-3">
                Bu kurallara uymayan kullanıcıların hesabı önceden bildirim yapılmaksızın askıya alınabilir veya silinebilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Fikri Mülkiyet</h2>
              <p>
                Sitemizin tasarımı, yazılımı, logosu ve özgün içerikleri Halkaarzlarım.com'a aittir. İzin alınmadan kopyalanamaz,
                dağıtılamaz veya türev çalışma oluşturulamaz. Üçüncü taraf kaynaklardan alınan veriler (SPK, KAP vb.) kendi
                lisans koşullarına tabidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Hizmet Kesintileri ve Değişiklikler</h2>
              <p>
                Bakım, güncelleme veya beklenmedik teknik sorunlar nedeniyle hizmette kesinti yaşanabilir. Halkaarzlarım.com,
                herhangi bir özelliği önceden bildirim yapmaksızın değiştirme, kısıtlama veya sonlandırma hakkını saklı tutar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Üçüncü Taraf Bağlantılar</h2>
              <p>
                Sitemiz; SPK, KAP, Borsa İstanbul ve diğer harici sitelere bağlantılar içerebilir. Bu sitelerin içerik ve
                gizlilik uygulamalarından Halkaarzlarım.com sorumlu değildir. Harici bağlantılara tıklamadan önce ilgili sitenin
                koşullarını incelemenizi öneririz.
              </p>
            </section>

            <hr className="border-slate-700/60" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Koşullardaki Değişiklikler</h2>
              <p>
                Bu kullanım koşulları zaman zaman güncellenebilir. Önemli değişiklikler sitemizde duyurulacaktır.
                Güncel koşullar her zaman bu sayfada yayımlanır. Değişikliklerden sonra sitemizi kullanmaya devam etmeniz
                yeni koşulları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Uygulanacak Hukuk</h2>
              <p>
                Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri
                yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">İletişim</h2>
              <p>
                Kullanım koşullarımız hakkında sorularınız için
                <a href="mailto:destek@halkaarzlarim.com" className="text-emerald-400 hover:underline ml-1">destek@halkaarzlarim.com</a>
                adresinden bize ulaşabilirsiniz.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
