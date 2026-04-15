import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Teknoloji", slug: "teknoloji" },
    { name: "Dünya", slug: "dunya" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Spor", slug: "spor" },
    { name: "Yaşam", slug: "yasam" },
    { name: "Seyahat", slug: "seyahat" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  const author = await prisma.author.upsert({
    where: { slug: "editor" },
    update: { name: "E-News Editör" },
    create: {
      slug: "editor",
      name: "E-News Editör",
      bio: "Güncel haber akışını hazırlayan editör ekibi.",
    },
  });

  const categoryBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [category.slug, category]),
  ) as Record<string, { id: string }>;

  const articles = [
    {
      slug: "yapay-zeka-destekli-ulasim-projesi-istanbulda-test-ediliyor",
      title: "Yapay Zeka Destekli Ulaşım Projesi İstanbul'da Test Ediliyor",
      summary:
        "Akıllı trafik yönetimi ve canlı veri analiziyle şehir içi ulaşım süresini azaltmayı hedefleyen proje, pilot bölgede olumlu sonuçlar verdi.",
      coverImage:
        "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1400&q=80",
      content: [
        "İstanbul Büyükşehir Belediyesi tarafından yürütülmeye başlanan proje, şehir genelindeki yoğun trafik noktalarından anlık veri topluyor.",
        "Yapay zeka tabanlı sistem, kavşaklardaki araç yoğunluğunu analiz ederek sinyal sürelerini dinamik biçimde optimize ediyor.",
        "Yetkililer, pilot bölgede yolculuk süresinde ortalama yüzde 18 iyileşme sağlandığını ve uygulamanın yıl sonuna kadar genişletileceğini belirtiyor.",
      ],
      categorySlug: "teknoloji",
      publishedAt: new Date("2026-04-14T09:00:00.000Z"),
      readTimeMin: 6,
      isFeatured: true,
    },
    {
      slug: "kuresel-enerji-zirvesinden-yenilenebilir-yatirim-karari",
      title: "Küresel Enerji Zirvesinden Yenilenebilir Yatırım Kararı",
      summary:
        "47 ülkenin katıldığı zirvede, 2030 hedefleri için yeşil enerji altyapısına ek finansman sağlanması kararı alındı.",
      coverImage:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80",
      content: [
        "Zirve kapsamında açıklanan yeni yol haritasında güneş ve rüzgar enerjisi projelerine hızlı finansman mekanizması ön plana çıktı.",
        "Katılımcı ülkeler, enerji dönüşümünde teknoloji transferi ve bölgesel iş birliği modellerini güçlendirme konusunda mutabık kaldı.",
        "Uzmanlar, kararların uygulanması halinde enerji maliyetlerinde orta vadede daha dengeli bir tablo oluşabileceğini değerlendiriyor.",
      ],
      categorySlug: "dunya",
      publishedAt: new Date("2026-04-14T08:00:00.000Z"),
      readTimeMin: 4,
      isFeatured: false,
    },
    {
      slug: "borsa-gune-teknoloji-hisselerindeki-yukselisle-basladi",
      title: "Borsa Güne Teknoloji Hisselerindeki Yükselişle Başladı",
      summary:
        "Yazılım ve yarı iletken şirketlerindeki alış baskısı, endeksin ilk seansta yukarı yönlü hareket etmesini sağladı.",
      coverImage:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
      content: [
        "Analistler, küresel piyasalardaki risk iştahının artmasının yerel teknoloji hisselerine de olumlu yansıdığını ifade ediyor.",
        "İşlem hacmindeki artışın özellikle büyük ölçekli şirket hisselerinde yoğunlaştığı ve endeksi yukarı taşıdığı görüldü.",
        "Gün içinde açıklanacak makroekonomik verilerin, kapanışa doğru fiyatlamaları yeniden şekillendirebileceği belirtiliyor.",
      ],
      categorySlug: "ekonomi",
      publishedAt: new Date("2026-04-14T07:00:00.000Z"),
      readTimeMin: 5,
      isFeatured: false,
    },
    {
      slug: "milli-takim-hazirlik-macinda-genclerle-guven-verdi",
      title: "Milli Takım Hazırlık Maçında Gençlerle Güven Verdi",
      summary:
        "Teknik ekibin rotasyonlu kadro tercihi, turnuva öncesi oyuncu derinliği açısından olumlu bir tablo ortaya koydu.",
      coverImage:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
      content: [
        "Hazırlık karşılaşmasında gençlerle deneyimli isimlerin birlikte kullanılması oyun disiplinini yüksek tuttu.",
        "Teknik heyet, fiziksel performans verilerinin beklentilerin üzerinde olduğunu ve kamp temposunun korunacağını duyurdu.",
        "Taraftarların ilgisiyle oynanan maçta takım savunması ve hızlı geçiş organizasyonları olumlu not aldı.",
      ],
      categorySlug: "spor",
      publishedAt: new Date("2026-04-13T09:00:00.000Z"),
      readTimeMin: 3,
      isFeatured: false,
    },
    {
      slug: "sehirde-bahar-festivali-basladi-5-gunde-120-etkinlik",
      title: "Şehirde Bahar Festivali Başladı: 5 Günde 120 Etkinlik",
      summary:
        "Konserlerden açık hava sergilerine uzanan program, farklı yaş gruplarına hitap eden zengin bir kültürel içerik sunuyor.",
      coverImage:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
      content: [
        "Festival alanında kurulan sahnelerde gün boyu müzik performansları ve sokak sanatçıları yer alıyor.",
        "Aile odaklı atölyeler ve çocuk etkinlikleri sayesinde haftanın her günü yoğun ziyaretçi bekleniyor.",
        "Organizasyon komitesi, etkinliklerin şehir ekonomisine canlılık katmasını ve turizm hareketliliğini desteklemesini hedefliyor.",
      ],
      categorySlug: "yasam",
      publishedAt: new Date("2026-04-13T07:00:00.000Z"),
      readTimeMin: 4,
      isFeatured: false,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        coverImage: article.coverImage,
        content: article.content,
        publishedAt: article.publishedAt,
        readTimeMin: article.readTimeMin,
        status: "PUBLISHED",
        isFeatured: article.isFeatured,
        categoryId: categoryBySlug[article.categorySlug].id,
        authorId: author.id,
      },
      create: {
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        coverImage: article.coverImage,
        content: article.content,
        publishedAt: article.publishedAt,
        readTimeMin: article.readTimeMin,
        status: "PUBLISHED",
        isFeatured: article.isFeatured,
        categoryId: categoryBySlug[article.categorySlug].id,
        authorId: author.id,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
