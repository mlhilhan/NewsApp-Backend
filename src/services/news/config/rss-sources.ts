export interface RSSSource {
  url: string;
  category: string;
  source: string;
}

export const rssSources: RSSSource[] = [
  // Son Dakika / Breaking News
  {
    url: "https://www.cnnturk.com/feed/rss/all/news",
    category: "breaking-news",
    source: "CNN Türk",
  },
  {
    url: "https://www.ntv.com.tr/son-dakika.rss",
    category: "breaking-news",
    source: "NTV",
  },
  {
    url: "https://www.trthaber.com/manset_articles.rss",
    category: "breaking-news",
    source: "TRT Haber",
  },

  // Gündem / Agenda
  {
    url: "https://www.hurriyet.com.tr/rss/gundem",
    category: "agenda",
    source: "Hürriyet",
  },
  {
    url: "https://www.sozcu.com.tr/rss/gundem.xml",
    category: "agenda",
    source: "Sözcü",
  },
  {
    url: "https://www.sabah.com.tr/rss/gundem.xml",
    category: "agenda",
    source: "Sabah",
  },
  {
    url: "https://www.cumhuriyet.com.tr/rss/gundem.xml",
    category: "agenda",
    source: "Cumhuriyet",
  },

  // Dünya / World
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/dunyarss.xml",
    category: "world",
    source: "Milliyet",
  },
  {
    url: "https://www.hurriyet.com.tr/rss/dunya",
    category: "world",
    source: "Hürriyet",
  },
  {
    url: "https://www.ntv.com.tr/dunya.rss",
    category: "world",
    source: "NTV",
  },
  {
    url: "https://www.sozcu.com.tr/rss/dunya.xml",
    category: "world",
    source: "Sözcü",
  },

  // Politika / Politics
  {
    url: "https://www.hurriyet.com.tr/rss/siyaset",
    category: "politics",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/siyasetrss.xml",
    category: "politics",
    source: "Milliyet",
  },
  {
    url: "https://www.sozcu.com.tr/rss/siyaset.xml",
    category: "politics",
    source: "Sözcü",
  },

  // Ekonomi / Economy
  {
    url: "https://www.sozcu.com.tr/rss/ekonomi.xml",
    category: "economy",
    source: "Sözcü",
  },
  {
    url: "https://www.hurriyet.com.tr/rss/ekonomi",
    category: "economy",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/ekonomirss.xml",
    category: "economy",
    source: "Milliyet",
  },
  {
    url: "https://www.ntv.com.tr/ekonomi.rss",
    category: "economy",
    source: "NTV",
  },
  {
    url: "https://www.bloomberght.com/rss",
    category: "economy",
    source: "Bloomberg HT",
  },

  // İş Dünyası / Business
  {
    url: "https://www.dunya.com/rss",
    category: "business",
    source: "Dünya Gazetesi",
  },
  {
    url: "https://www.haberturk.com/rss/ekonomi.xml",
    category: "business",
    source: "Habertürk",
  },

  // Teknoloji / Technology
  {
    url: "https://www.ntv.com.tr/teknoloji.rss",
    category: "technology",
    source: "NTV",
  },
  {
    url: "https://shiftdelete.net/feed",
    category: "technology",
    source: "ShiftDelete",
  },
  {
    url: "https://www.webtekno.com/rss.xml",
    category: "technology",
    source: "Webtekno",
  },
  {
    url: "https://www.technopat.net/feed/",
    category: "technology",
    source: "Technopat",
  },
  {
    url: "https://www.chip.com.tr/rss/anasayfa.xml",
    category: "technology",
    source: "Chip",
  },

  // Bilim / Science
  {
    url: "https://bilimvegelecek.com.tr/index.php/feed/",
    category: "science",
    source: "Bilim ve Gelecek",
  },
  {
    url: "https://www.bilimkurgukulubu.com/feed/",
    category: "science",
    source: "Bilim Kurgu Kulübü",
  },
  {
    url: "https://evrimagaci.org/rss.xml",
    category: "science",
    source: "Evrim Ağacı",
  },

  // Sağlık / Health
  {
    url: "https://www.hurriyet.com.tr/rss/saglik",
    category: "health",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/saglikrss.xml",
    category: "health",
    source: "Milliyet",
  },
  {
    url: "https://www.ntv.com.tr/saglik.rss",
    category: "health",
    source: "NTV",
  },

  // Eğitim / Education
  {
    url: "https://www.hurriyet.com.tr/rss/egitim",
    category: "education",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/egitimrss.xml",
    category: "education",
    source: "Milliyet",
  },

  // Spor / Sports
  {
    url: "https://www.haberturk.com/rss/spor.xml",
    category: "sports",
    source: "Habertürk",
  },
  {
    url: "https://www.hurriyet.com.tr/rss/spor",
    category: "sports",
    source: "Hürriyet",
  },
  {
    url: "https://www.ntv.com.tr/spor.rss",
    category: "sports",
    source: "NTV",
  },
  {
    url: "https://www.sporx.com/_xml/rss.php",
    category: "sports",
    source: "Sporx",
  },
  {
    url: "https://www.fanatik.com.tr/rss/anasayfa.xml",
    category: "sports",
    source: "Fanatik",
  },

  // Futbol / Football
  {
    url: "https://www.goal.com/tr/feeds/news?fmt=rss",
    category: "football",
    source: "Goal",
  },
  {
    url: "https://www.mackolik.com/feed/rss/futbol",
    category: "football",
    source: "Maçkolik",
  },

  // Basketbol / Basketball
  {
    url: "https://www.basketbolplus.com/feed/",
    category: "basketball",
    source: "Basketbol Plus",
  },
  {
    url: "https://www.eurohoops.net/tr/feed/",
    category: "basketball",
    source: "Eurohoops",
  },

  // Magazin / Entertainment
  {
    url: "https://www.hurriyet.com.tr/rss/magazin",
    category: "entertainment",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/magazinrss.xml",
    category: "entertainment",
    source: "Milliyet",
  },
  {
    url: "https://www.ntv.com.tr/magazin.rss",
    category: "entertainment",
    source: "NTV",
  },

  // Kültür Sanat / Culture Art
  {
    url: "https://www.hurriyet.com.tr/rss/kultur-sanat",
    category: "culture-art",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/kultursanatrss.xml",
    category: "culture-art",
    source: "Milliyet",
  },
  {
    url: "https://www.ntv.com.tr/sanat.rss",
    category: "culture-art",
    source: "NTV",
  },

  // Yaşam / Lifestyle
  {
    url: "https://www.hurriyet.com.tr/rss/yasam",
    category: "lifestyle",
    source: "Hürriyet",
  },
  {
    url: "https://www.ntv.com.tr/yasam.rss",
    category: "lifestyle",
    source: "NTV",
  },

  // Seyahat / Travel
  {
    url: "https://www.hurriyet.com.tr/rss/seyahat",
    category: "travel",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/tatilrss.xml",
    category: "travel",
    source: "Milliyet",
  },

  // Otomobil / Automotive
  {
    url: "https://www.hurriyet.com.tr/rss/otomobil",
    category: "automotive",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/otomobilrss.xml",
    category: "automotive",
    source: "Milliyet",
  },
  {
    url: "https://www.ntv.com.tr/otomobil.rss",
    category: "automotive",
    source: "NTV",
  },
  {
    url: "https://www.otoajanda.com/feed/",
    category: "automotive",
    source: "Oto Ajanda",
  },

  // Emlak / Real Estate
  {
    url: "https://www.hurriyet.com.tr/rss/emlak",
    category: "real-estate",
    source: "Hürriyet",
  },
  {
    url: "https://www.milliyet.com.tr/rss/rssnew/emlakrss.xml",
    category: "real-estate",
    source: "Milliyet",
  },

  // Çevre / Environment
  {
    url: "https://www.ntv.com.tr/cevre.rss",
    category: "environment",
    source: "NTV",
  },
  {
    url: "https://www.yesilist.com/feed/",
    category: "environment",
    source: "Yeşilist",
  },

  // Yerel / Local
  {
    url: "https://www.iha.com.tr/rss/kategori/Guncel/5/",
    category: "local",
    source: "İhlas Haber Ajansı",
  },
  {
    url: "https://www.haberler.com/rss",
    category: "local",
    source: "Haberler.com",
  },
];
