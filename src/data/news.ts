import type { NewsItem } from "@/types/news";

export const featuredNews: NewsItem = {
  id: "1",
  slug: "yapay-zeka-destekli-ulasim-projesi-istanbulda-test-ediliyor",
  title: "Yapay Zeka Destekli Ulaşım Projesi İstanbul'da Test Ediliyor",
  category: "Teknoloji",
  summary:
    "Akıllı trafik yönetimi ve canlı veri analiziyle şehir içi ulaşım süresini azaltmayı hedefleyen proje, pilot bölgede olumlu sonuçlar verdi.",
  content: [
    "İstanbul Büyükşehir Belediyesi tarafından yürütülmeye başlanan proje, şehir genelindeki yoğun trafik noktalarından anlık veri topluyor.",
    "Yapay zeka tabanlı sistem, kavşaklardaki araç yoğunluğunu analiz ederek sinyal sürelerini dinamik biçimde optimize ediyor.",
    "Yetkililer, pilot bölgede yolculuk süresinde ortalama yüzde 18 iyileşme sağlandığını ve uygulamanın yıl sonuna kadar genişletileceğini belirtiyor.",
  ],
  imageUrl:
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1400&q=80",
  publishedAt: "14 Nisan 2026",
  readTime: "6 dk",
};

export const latestNews: NewsItem[] = [
  {
    id: "2",
    slug: "kuresel-enerji-zirvesinden-yenilenebilir-yatirim-karari",
    title: "Küresel Enerji Zirvesinden Yenilenebilir Yatırım Kararı",
    category: "Dünya",
    summary:
      "47 ülkenin katıldığı zirvede, 2030 hedefleri için yeşil enerji altyapısına ek finansman sağlanması kararı alındı.",
    content: [
      "Zirve kapsamında açıklanan yeni yol haritasında güneş ve rüzgar enerjisi projelerine hızlı finansman mekanizması ön plana çıktı.",
      "Katılımcı ülkeler, enerji dönüşümünde teknoloji transferi ve bölgesel iş birliği modellerini güçlendirme konusunda mutabık kaldı.",
      "Uzmanlar, kararların uygulanması halinde enerji maliyetlerinde orta vadede daha dengeli bir tablo oluşabileceğini değerlendiriyor.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80",
    publishedAt: "14 Nisan 2026",
    readTime: "4 dk",
  },
  {
    id: "3",
    slug: "borsa-gune-teknoloji-hisselerindeki-yukselisle-basladi",
    title: "Borsa Güne Teknoloji Hisselerindeki Yükselişle Başladı",
    category: "Ekonomi",
    summary:
      "Yazılım ve yarı iletken şirketlerindeki alış baskısı, endeksin ilk seansta yukarı yönlü hareket etmesini sağladı.",
    content: [
      "Analistler, küresel piyasalardaki risk iştahının artmasının yerel teknoloji hisselerine de olumlu yansıdığını ifade ediyor.",
      "İşlem hacmindeki artışın özellikle büyük ölçekli şirket hisselerinde yoğunlaştığı ve endeksi yukarı taşıdığı görüldü.",
      "Gün içinde açıklanacak makroekonomik verilerin, kapanışa doğru fiyatlamaları yeniden şekillendirebileceği belirtiliyor.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    publishedAt: "14 Nisan 2026",
    readTime: "5 dk",
  },
  {
    id: "4",
    slug: "milli-takim-hazirlik-macinda-genclerle-guven-verdi",
    title: "Milli Takım Hazırlık Maçında Gençlerle Güven Verdi",
    category: "Spor",
    summary:
      "Teknik ekibin rotasyonlu kadro tercihi, turnuva öncesi oyuncu derinliği açısından olumlu bir tablo ortaya koydu.",
    content: [
      "Hazırlık karşılaşmasında gençlerle deneyimli isimlerin birlikte kullanılması oyun disiplinini yüksek tuttu.",
      "Teknik heyet, fiziksel performans verilerinin beklentilerin üzerinde olduğunu ve kamp temposunun korunacağını duyurdu.",
      "Taraftarların ilgisiyle oynanan maçta takım savunması ve hızlı geçiş organizasyonları olumlu not aldı.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
    publishedAt: "13 Nisan 2026",
    readTime: "3 dk",
  },
  {
    id: "5",
    slug: "sehirde-bahar-festivali-basladi-5-gunde-120-etkinlik",
    title: "Şehirde Bahar Festivali Başladı: 5 Günde 120 Etkinlik",
    category: "Yaşam",
    summary:
      "Konserlerden açık hava sergilerine uzanan program, farklı yaş gruplarına hitap eden zengin bir kültürel içerik sunuyor.",
    content: [
      "Festival alanında kurulan sahnelerde gün boyu müzik performansları ve sokak sanatçıları yer alıyor.",
      "Aile odaklı atölyeler ve çocuk etkinlikleri sayesinde haftanın her günü yoğun ziyaretçi bekleniyor.",
      "Organizasyon komitesi, etkinliklerin şehir ekonomisine canlılık katmasını ve turizm hareketliliğini desteklemesini hedefliyor.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    publishedAt: "13 Nisan 2026",
    readTime: "4 dk",
  },
];

export const allNews: NewsItem[] = [featuredNews, ...latestNews];

export const newsCategories: string[] = [
  "Tüm",
  ...new Set(allNews.map((article) => article.category)),
];

export function getNewsBySlug(slug: string) {
  return allNews.find((article) => article.slug === slug);
}
