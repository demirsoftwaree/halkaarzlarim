import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";

export const metadata = {
  title: "Gizlilik Politikası — Halkaarzlarım.com",
  description: "Halkaarzlarım.com gizlilik politikası — kişisel verilerin toplanması, kullanımı ve korunması hakkında bilgi.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <TickerBar />
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Gizlilik Politikası</h1>
            <p className="text-slate-500 text-sm">Son güncelleme: Mart 2026</p>
          </div>

          {/* İçerik */}
          <div className="prose-custom space-y-8 text-slate-300 leading-relaxed">

            <p>
              Bu Gizlilik Politikası, <strong className="text-white">Halkaarzlarım.com</strong> ("sitemiz") üzerinden sunulan hizmetler için geçerlidir.
              Sitemizi kullanmaya devam ederek bu politikayı kabul etmiş sayılırsınız. Politikayı kabul etmiyorsanız lütfen sitemizi kullanmayınız.
            </p>

            {/* --- */}
            <hr className="border-slate-700/60" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Hangi verileri topluyoruz</h2>
              <p>
                Sitemizde hesap oluşturduğunuzda aşağıdaki bilgileri toplarız:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
                <li>Ad, soyad veya kullanıcı adı</li>
                <li>E-posta adresi</li>
                <li>Google hesabıyla giriş yapılması durumunda Google tarafından sağlanan profil bilgileri (ad, fotoğraf)</li>
              </ul>
              <p className="mt-3">
                Bunlara ek olarak; ziyaret ettiğiniz sayfalar, kullandığınız araçlar, takip listenize eklediğiniz arzlar ve portföy girişleriniz gibi
                kullanım verileri de sistemimizde saklanır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Verilerinizi nasıl kullanıyoruz</h2>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li>Hesabınızı yönetmek ve kimliğinizi doğrulamak için</li>
                <li>Takip listesi, portföy ve kişisel tercihlerinizi kaydetmek için</li>
                <li>Premium üyelik durumunu kontrol etmek ve hizmet sunmak için</li>
                <li>Hizmet kalitesini ölçmek ve geliştirmek için (anonim analiz)</li>
                <li>Yasal yükümlülükleri yerine getirmek için</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Çerezler</h3>
              <p>
                Sitemiz oturum yönetimi amacıyla çerezler kullanır. Giriş yaptığınızda tarayıcınıza güvenli bir oturum çerezi (<code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm">__session</code>) yerleştirilir.
                Bu çerez 5 gün geçerlidir ve yalnızca oturumunuzu açık tutmak için kullanılır; üçüncü taraflarla paylaşılmaz.
              </p>
              <p className="mt-2">
                Çıkış yaptığınızda oturum çerezi silinir. Tarayıcı ayarlarından çerezleri devre dışı bırakabilirsiniz ancak bu durumda giriş gerektiren özellikler çalışmayabilir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Diğer sitelerden gömülen içerik</h3>
              <p>
                Sitemizde yer alan grafik ve piyasa verileri Yahoo Finance, SPK ve KAP gibi üçüncü taraf kaynaklardan alınmaktadır.
                Bu kaynaklar kendi gizlilik politikalarına tabi olup ziyaretçi verilerini bağımsız olarak toplayabilir.
                Gömülü içeriklerin bulunduğu sayfalara eriştiğinizde söz konusu üçüncü tarafların çerez ve izleme mekanizmaları etkinleşebilir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Analiz</h3>
              <p>
                Site trafiğini ve kullanım kalıplarını anlamak amacıyla Google Analytics gibi anonim analiz araçları kullanılabilir.
                Bu araçlar kişisel olarak tanımlanabilir bilgi toplamaz; yalnızca toplu istatistikler üretir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Reklamlar</h3>
              <p>
                Ücretsiz hesaplarda Google AdSense aracılığıyla reklam gösterilebilir. AdSense, ilgi alanlarınıza uygun reklamlar sunmak için çerez kullanabilir.
                Premium üyelerin herhangi bir reklam içeriğiyle karşılaşmaması sağlanır. Google'ın reklam çerezlerini yönetmek için
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline ml-1">Google Reklam Ayarları</a>'nı
                ziyaret edebilirsiniz.
              </p>
            </section>

            {/* --- */}
            <hr className="border-slate-700/60" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Verilerinizi ne kadar süre tutarız</h2>
              <p>
                Hesabınıza ait veriler (profil bilgileri, takip listesi, portföy kayıtları) hesabınız aktif olduğu sürece saklanır.
                Hesabınızı silmek istediğinizde tüm kişisel verileriniz kalıcı olarak silinir.
              </p>
              <p className="mt-2">
                Yasal yükümlülükler, dolandırıcılığı önleme veya güvenlik nedenleriyle zorunlu olan veriler bu kuralın istisnasını oluşturabilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Verileriniz üzerindeki haklarınız</h2>
              <p>Bu site üzerinde hesap oluşturmuş kullanıcılar olarak:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
                <li>Sakladığımız kişisel verilerinizin bir kopyasını talep edebilirsiniz.</li>
                <li>Hatalı veya eksik verilerinizin düzeltilmesini isteyebilirsiniz.</li>
                <li>Kişisel verilerinizin tamamen silinmesini talep edebilirsiniz.</li>
                <li>Verilerinizin işlenmesine itiraz edebilirsiniz.</li>
              </ul>
              <p className="mt-3">
                Söz konusu hakları kullanmak için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
                Talebiniz yasal süre içinde (30 gün) yanıtlanır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Verinizi nereye gönderiyoruz</h2>
              <p>
                Kişisel verileriniz yalnızca hizmetin teknik altyapısını oluşturan Firebase (Google Cloud) sunucularında saklanır.
                Verileriniz üçüncü taraf reklam ağlarına veya veri brokerlarına satılmaz ve aktarılmaz.
              </p>
              <p className="mt-2">
                Altyapı sağlayıcıları olan Google Firebase'in kendi gizlilik politikası geçerli olup bu politikaya
                <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline ml-1">buradan</a> ulaşabilirsiniz.
              </p>
            </section>

            {/* --- */}
            <hr className="border-slate-700/60" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Veri güvenliği</h2>
              <p>
                Verilerinizi korumak için HTTPS şifrelemesi, güvenli oturum çerezleri (httpOnly, SameSite) ve Firebase güvenlik kuralları kullanıyoruz.
                Hiçbir sistem yüzde yüz güvenli olmamakla birlikte kişisel bilgilerinizi korumak için makul teknik önlemleri alıyoruz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">İletişim</h2>
              <p>
                Gizlilik politikamız hakkında soru ve yorumlarınızı
                <a href="mailto:destek@halkaarzlarim.com" className="text-emerald-400 hover:underline ml-1">destek@halkaarzlarim.com</a>
                adresine iletebilirsiniz.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
