export type SozlukEntry = {
  id: number;
  kibrisca: string;
  anlam: string;
  cumle: string;
  kategori: "günlük" | "argo" | "deyim" | "anlam farkı" | "ünlem" | "yemek" | "kültür" | "sevgi" | "doğa" | "alet" | "araç" | "mekan";
  emoji: string;
  zorluk: "kolay" | "orta" | "zor";
};

export const sozlukData: SozlukEntry[] = [
  // ── Mevcut kelimeler ──────────────────────────────────────────
  { id: 1,  kibrisca: "Aya",             anlam: "Yani / Hay aksi / Şaşırma ünlemi",              cumle: "Aya sen bunu biliyor muydun?",                        kategori: "ünlem",      emoji: "😲", zorluk: "kolay" },
  { id: 2,  kibrisca: "Marafoncu",       anlam: "Çok konuşan, palabre yapan kişi",               cumle: "O marafoncuya aldırma saatlerdir konuşuyor",          kategori: "günlük",     emoji: "🗣️", zorluk: "kolay" },
  { id: 3,  kibrisca: "Palabre",         anlam: "Boş/anlamsız konuşma, havadan Sudan",           cumle: "Hep palabre yapıyor iş yapmıyor",                    kategori: "günlük",     emoji: "💬", zorluk: "kolay" },
  { id: 4,  kibrisca: "Zımbırdak",       anlam: "Yaramaz, haylaz çocuk",                        cumle: "O zımbırdak yine bir iş çıkardı",                    kategori: "günlük",     emoji: "👦", zorluk: "orta"  },
  { id: 5,  kibrisca: "Şallambur",       anlam: "Sarkık, sarkan, düzensiz şey",                 cumle: "O şallambur çantayı artık at",                       kategori: "günlük",     emoji: "👜", zorluk: "orta"  },
  { id: 6,  kibrisca: "Gıtır",           anlam: "Git (kaba/argo)",                               cumle: "Gıtır burdan be adam",                               kategori: "argo",       emoji: "👋", zorluk: "kolay" },
  { id: 7,  kibrisca: "Yüksek",          anlam: "Sarhoş",                                       cumle: "Adam yüksek geldi partiye",                          kategori: "argo",       emoji: "🍺", zorluk: "orta"  },
  { id: 8,  kibrisca: "Pişman olmak",    anlam: "Bıkmak / usanmak (Türkiye'den farklı anlam)",  cumle: "Bu işten tamamen pişman oldum",                      kategori: "anlam farkı",emoji: "😤", zorluk: "zor"   },
  { id: 9,  kibrisca: "Maşallah",        anlam: "Kıbrıs'ta 'çok' anlamında da kullanılır",      cumle: "Maşallah yoruldu adam",                              kategori: "anlam farkı",emoji: "🤲", zorluk: "zor"   },
  { id: 10, kibrisca: "Gavur",           anlam: "Rum Kıbrıslı / yabancı (nötr kullanım)",       cumle: "Gavur mahallesinden geçtik",                         kategori: "kültür",     emoji: "🤝", zorluk: "orta"  },
  { id: 11, kibrisca: "Hışt",            anlam: "Psst / Hey (birini çağırma sesi)",              cumle: "Hışt, beri gel bir saniye",                          kategori: "ünlem",      emoji: "🤫", zorluk: "kolay" },
  { id: 12, kibrisca: "Zart",            anlam: "Tam / direk (vurgu için)",                      cumle: "Zart yüzüne söyledi",                                kategori: "günlük",     emoji: "💥", zorluk: "kolay" },
  { id: 13, kibrisca: "Kömbeli",         anlam: "Kıbrıs usulü içli börek/hamur işi",            cumle: "Nene kömbeli yaptı bugün",                           kategori: "yemek",      emoji: "🥟", zorluk: "orta"  },
  { id: 14, kibrisca: "Hellim",          anlam: "Halloumi peyniri (Kıbrıs'ın milli peyniri)",   cumle: "Sabah kahvaltıda hellim olmazsa olmaz",              kategori: "yemek",      emoji: "🧀", zorluk: "kolay" },
  { id: 15, kibrisca: "Molehiya",        anlam: "Kıbrıs'a özgü yeşil yapraklı sebze yemeği",   cumle: "Molehiya yemeyi sevmeyenler Kıbrıslı değildir",      kategori: "yemek",      emoji: "🥬", zorluk: "orta"  },
  { id: 16, kibrisca: "Şeker bayramı",   anlam: "Ramazan bayramı (Kıbrıs kullanımı)",           cumle: "Şeker bayramında akrabaları ziyaret ettik",          kategori: "kültür",     emoji: "🎉", zorluk: "kolay" },
  { id: 17, kibrisca: "Muhtarlık",       anlam: "Köy/mahalle yönetim birimi",                   cumle: "Muhtarlığa gidip kaydımı yaptırdım",                 kategori: "kültür",     emoji: "🏛️", zorluk: "orta"  },
  { id: 18, kibrisca: "Tamam mı tamam",  anlam: "Anlaştık / peki (onaylama)",                   cumle: "Yarın gelirim tamam mı tamam",                       kategori: "günlük",     emoji: "👍", zorluk: "kolay" },
  { id: 19, kibrisca: "Paşa",            anlam: "Sevgi ifadesi (çocuğa hitap)",                 cumle: "Gel bakalım paşam ne istiyorsun",                    kategori: "sevgi",      emoji: "👑", zorluk: "kolay" },
  { id: 20, kibrisca: "Bezirganlık",     anlam: "Cimrilik, pintilik",                           cumle: "O kadar bezirganlık yapma bir kahve ısmarla",        kategori: "günlük",     emoji: "💰", zorluk: "zor"   },

  // ── A ────────────────────────────────────────────────────────
  { id: 21, kibrisca: "Agsona",          anlam: "Dingil",                                       cumle: "Arabann agsonu kırılmış, gidemeyiz",                 kategori: "araç",       emoji: "⚙️", zorluk: "zor"   },
  { id: 22, kibrisca: "Alina",           anlam: "Hindi",                                        cumle: "Şeker bayramında alina kestik",                      kategori: "doğa",       emoji: "🦃", zorluk: "orta"  },
  { id: 23, kibrisca: "Alizavra",        anlam: "Gökyeşil kertenkele",                          cumle: "Alizavra bahçede güneşleniyordu",                    kategori: "doğa",       emoji: "🦎", zorluk: "zor"   },
  { id: 24, kibrisca: "Argaci",          anlam: "Küçük su yolu, dere",                          cumle: "Argacinin yanında otururduk yazın",                  kategori: "doğa",       emoji: "💧", zorluk: "zor"   },
  { id: 25, kibrisca: "Ariya",           anlam: "Matkap",                                       cumle: "Ariyayı al duvara bak bir delik aç",                 kategori: "alet",       emoji: "🔩", zorluk: "orta"  },
  { id: 26, kibrisca: "Arsanafiligo",    anlam: "Çift cinsiyetli kişi",                         cumle: "Mahallenin arsanafiligosundan bahsediyorlardı",       kategori: "günlük",     emoji: "🤷", zorluk: "zor"   },
  { id: 27, kibrisca: "Asvalya",         anlam: "Sigorta",                                      cumle: "Asvalyanı yaptırdın mı bu ay?",                      kategori: "günlük",     emoji: "🔒", zorluk: "orta"  },
  { id: 28, kibrisca: "Avlu",            anlam: "Bahçe, açık alan",                             cumle: "Avluda oturup çay içtik akşamüstü",                  kategori: "mekan",      emoji: "🌿", zorluk: "kolay" },
  { id: 29, kibrisca: "Ayrelli",         anlam: "Kuşkonmaz",                                    cumle: "Ayrelli salatası yaptı bugün",                       kategori: "yemek",      emoji: "🌱", zorluk: "zor"   },

  // ── B ────────────────────────────────────────────────────────
  { id: 30, kibrisca: "Babavura",        anlam: "Uğur böceği",                                  cumle: "Babavura koluma kondu, şans getirir",                kategori: "doğa",       emoji: "🐞", zorluk: "kolay" },
  { id: 31, kibrisca: "Babuç",           anlam: "Pabuç, ayakkabı",                              cumle: "Babuçlarını kapının önüne bırak",                    kategori: "günlük",     emoji: "👟", zorluk: "kolay" },
  { id: 32, kibrisca: "Babutsa",         anlam: "Dikenli mısır inciri (kaktüs meyvesi)",        cumle: "Babutsa toplarken dikkat et dikenlerine",            kategori: "yemek",      emoji: "🌵", zorluk: "zor"   },
  { id: 33, kibrisca: "Bango",           anlam: "Tezgah, sayaç",                                cumle: "Bankoda oturup satıyordu sebzelerini",               kategori: "mekan",      emoji: "🪧", zorluk: "orta"  },
  { id: 34, kibrisca: "Bandofla",        anlam: "Terlik",                                       cumle: "Bandoflaları kapıda bırak içeri girme",              kategori: "günlük",     emoji: "🩴", zorluk: "kolay" },
  { id: 35, kibrisca: "Badadez",         anlam: "Patates",                                      cumle: "Badadez kızartması yaptım akşama",                   kategori: "yemek",      emoji: "🥔", zorluk: "kolay" },
  { id: 36, kibrisca: "Barra",           anlam: "Tahta direk; birisini defetmek için argo",     cumle: "Barra ona, gitsin oradan",                           kategori: "argo",       emoji: "🪵", zorluk: "orta"  },
  { id: 37, kibrisca: "Basadembo",       anlam: "Tuzlu kabak çekirdeği",                        cumle: "Basadembo yer misin, getireyim?",                    kategori: "yemek",      emoji: "🌰", zorluk: "orta"  },
  { id: 38, kibrisca: "Bandabulya",      anlam: "Belediye kapalı çarşısı, pazar yeri",          cumle: "Bandabulyadan taze sebze aldım sabah",               kategori: "mekan",      emoji: "🏪", zorluk: "orta"  },
  { id: 39, kibrisca: "Basbalya",        anlam: "Tokat, şaplak",                                cumle: "Bir basbalya yiyeceksin o kafayla",                  kategori: "günlük",     emoji: "👊", zorluk: "kolay" },
  { id: 40, kibrisca: "Basdiş",          anlam: "Acı badem kurabiyesi",                         cumle: "Nene her yıl basdiş yapar bayramda",                 kategori: "yemek",      emoji: "🍪", zorluk: "zor"   },
  { id: 41, kibrisca: "Batsali",         anlam: "Zehirli bir yılan türü",                       cumle: "Yolda batsali gördüm, dikkat et",                    kategori: "doğa",       emoji: "🐍", zorluk: "zor"   },
  { id: 42, kibrisca: "Bavuri",          anlam: "Matara, küçük bidon",                          cumle: "Bavuriye su doldur da yola çıkalım",                 kategori: "alet",       emoji: "🫙", zorluk: "orta"  },
  { id: 43, kibrisca: "Bas",             anlam: "Otobüs",                                       cumle: "Basa yetiş yoksa geç kalırsın",                      kategori: "araç",       emoji: "🚌", zorluk: "kolay" },
  { id: 44, kibrisca: "Bariya",          anlam: "Arkadaş grubu, takım",                         cumle: "Bütün bariya toplanmış kafede",                      kategori: "günlük",     emoji: "👥", zorluk: "orta"  },
  { id: 45, kibrisca: "Belesbit",        anlam: "Bisiklet",                                     cumle: "Belesbitimle okula gidiyorum her gün",               kategori: "araç",       emoji: "🚲", zorluk: "kolay" },
  { id: 46, kibrisca: "Belo",            anlam: "Melez köpek, kırma köpek",                     cumle: "O belo köpek yine bahçeye girdi",                    kategori: "doğa",       emoji: "🐕", zorluk: "kolay" },
  { id: 47, kibrisca: "Beytambal galsın",anlam: "Eksik kalsın (beddua)",                        cumle: "Beytambal galsın o herife, hiç yardım etmedi",       kategori: "deyim",      emoji: "😤", zorluk: "zor"   },
  { id: 48, kibrisca: "Betsi",           anlam: "Yassı sünger veya emici bez",                  cumle: "Betsiyle sildim yerleri",                            kategori: "alet",       emoji: "🧽", zorluk: "zor"   },
  { id: 49, kibrisca: "Bitda",           anlam: "Börek",                                        cumle: "Bitda yaptım fırında, gel ye",                       kategori: "yemek",      emoji: "🥟", zorluk: "kolay" },
  { id: 50, kibrisca: "Birceğez",        anlam: "Bir tane, sadece bir",                         cumle: "Birceğez kaldı, iyi kullan",                         kategori: "günlük",     emoji: "1️⃣", zorluk: "orta"  },
  { id: 51, kibrisca: "Biddaga",         anlam: "Yayvan, geniş ve yassı",                       cumle: "O biddaga kap bunun için güzel olur",                kategori: "günlük",     emoji: "📐", zorluk: "zor"   },
  { id: 52, kibrisca: "Boru",            anlam: "Korna",                                        cumle: "Boruya basma komşuları uyandırırsın",                kategori: "araç",       emoji: "📯", zorluk: "kolay" },
  { id: 53, kibrisca: "Bodiri",          anlam: "Küçük bardak (veya kısa boylu kişi)",          cumle: "Bir bodiri rakı ver de oturalım",                    kategori: "günlük",     emoji: "🥃", zorluk: "orta"  },
  { id: 54, kibrisca: "Bondoboksi",      anlam: "Kısa boylu kimse",                             cumle: "O bondoboksi herkesten önce geçip öne geçti",        kategori: "argo",       emoji: "👤", zorluk: "orta"  },
  { id: 55, kibrisca: "Bögün",           anlam: "Bugün",                                        cumle: "Bögün nereye gidiyorsun?",                           kategori: "günlük",     emoji: "📅", zorluk: "kolay" },
  { id: 56, kibrisca: "Bögüce",          anlam: "Bu gece",                                      cumle: "Bögüce misafir gelecek hazırlık yapın",              kategori: "günlük",     emoji: "🌙", zorluk: "kolay" },
  { id: 57, kibrisca: "Buncaçcık",       anlam: "Minicik, çok küçük",                           cumle: "Buncaçcık bir çocuktu, şimdi dev gibi",              kategori: "günlük",     emoji: "🤏", zorluk: "orta"  },
  { id: 58, kibrisca: "Bullez",          anlam: "Yer elması (yerelma)",                          cumle: "Bullez çorbası sağlığa çok iyi",                     kategori: "yemek",      emoji: "🥔", zorluk: "zor"   },
  { id: 59, kibrisca: "Bulli",           anlam: "Piliç, tavuk",                                 cumle: "Bulli ızgara yaptık akşam yemeğine",                 kategori: "yemek",      emoji: "🍗", zorluk: "kolay" },
  { id: 60, kibrisca: "Bullim",          anlam: "Canım (sevgi hitabı)",                         cumle: "Bullim ne oldu sana, anlat bakalım",                 kategori: "sevgi",      emoji: "💛", zorluk: "kolay" },
  { id: 61, kibrisca: "Bullo",           anlam: "Kuş (genel)",                                  cumle: "Sabah bullo sesleriyle uyandım",                     kategori: "doğa",       emoji: "🐦", zorluk: "kolay" },
  { id: 62, kibrisca: "Buraşda",         anlam: "Burada",                                       cumle: "Buraşda dur, ben geliyorum",                         kategori: "günlük",     emoji: "📍", zorluk: "kolay" },

  // ── C ────────────────────────────────────────────────────────
  { id: 63, kibrisca: "Cira",            anlam: "Rum Kıbrıslı kadın",                           cumle: "Komşu cira bize portakal getirdi",                   kategori: "kültür",     emoji: "👩", zorluk: "orta"  },
  { id: 64, kibrisca: "Cirilenmek",      anlam: "Yuvarlanmak",                                  cumle: "Çocuk tepeden aşağı cirilendi",                      kategori: "günlük",     emoji: "🔄", zorluk: "orta"  },
  { id: 65, kibrisca: "Cigla",           anlam: "Ardıçkuşu",                                    cumle: "Cigla kışın gelir bu tarafa",                        kategori: "doğa",       emoji: "🐦", zorluk: "zor"   },
  { id: 66, kibrisca: "Cizro",           anlam: "Ağustos böceği",                               cumle: "Yazın cizrolar hiç susmaz",                          kategori: "doğa",       emoji: "🦗", zorluk: "orta"  },

  // ── Ç ────────────────────────────────────────────────────────
  { id: 67, kibrisca: "Çakizdez",        anlam: "Tuzlu kırılmış ve kurutulmuş yeşil zeytin",   cumle: "Çakizdez olmadan kahvaltı olmaz",                    kategori: "yemek",      emoji: "🫒", zorluk: "orta"  },

  // ── D ────────────────────────────────────────────────────────
  { id: 68, kibrisca: "Dari",            anlam: "Mısır",                                        cumle: "Dari sezonu geldi, tarlada çok var",                 kategori: "yemek",      emoji: "🌽", zorluk: "kolay" },
  { id: 69, kibrisca: "Deplek",          anlam: "Darbuka",                                      cumle: "Deplek çalmayı nereden öğrendin?",                   kategori: "kültür",     emoji: "🥁", zorluk: "orta"  },
  { id: 70, kibrisca: "Della",           anlam: "Kargo bantı, kalın renkli paketleme bandı",    cumle: "Koliye della sar sağlam tutulsun",                   kategori: "alet",       emoji: "🎁", zorluk: "zor"   },
  { id: 71, kibrisca: "Dirifil",         anlam: "Yonca",                                        cumle: "Tarlada dirifil bitti, eşeğe ne vereceğiz",          kategori: "doğa",       emoji: "🌿", zorluk: "zor"   },
  { id: 72, kibrisca: "Ditsiro",         anlam: "Zavallı, zayıf, bitkin",                       cumle: "Ditsiro çocuğa iyi bak",                             kategori: "argo",       emoji: "😔", zorluk: "orta"  },
  { id: 73, kibrisca: "Domadez",         anlam: "Domates",                                      cumle: "Domadez salatası olmazsa yemek yenmez",              kategori: "yemek",      emoji: "🍅", zorluk: "kolay" },
  { id: 74, kibrisca: "Dümen",           anlam: "Direksiyon",                                   cumle: "Dümeni sıkı tut yol bozuk",                          kategori: "araç",       emoji: "🚗", zorluk: "kolay" },

  // ── E ────────────────────────────────────────────────────────
  { id: 75, kibrisca: "Ekşi",            anlam: "Limon",                                        cumle: "Salataya ekşi sık daha güzel olur",                  kategori: "yemek",      emoji: "🍋", zorluk: "kolay" },

  // ── F ────────────────────────────────────────────────────────
  { id: 76, kibrisca: "Fanella",         anlam: "Fanila, atlet",                                cumle: "Fanellani giymeden çıkma soğuk var",                 kategori: "günlük",     emoji: "👕", zorluk: "kolay" },
  { id: 77, kibrisca: "Fago",            anlam: "İleri derecede görme sorunu olan",             cumle: "Fago gibi bakıyor görmüyor musun?",                  kategori: "argo",       emoji: "👓", zorluk: "orta"  },
  { id: 78, kibrisca: "Fasariya",        anlam: "Gereksiz, lüzumsuz",                           cumle: "Fasariya şeylerle uğraşma zamanını boşa harcama",   kategori: "günlük",     emoji: "🙅", zorluk: "orta"  },
  { id: 79, kibrisca: "Fica",            anlam: "Yosun, deniz yosunu",                          cumle: "Fica kayalıkları kaplaymış, kayarsın dikkat et",     kategori: "doğa",       emoji: "🌿", zorluk: "zor"   },
  { id: 80, kibrisca: "Fortigo",         anlam: "Kamyon",                                       cumle: "Fortigo yolu kapattı geçemiyoruz",                   kategori: "araç",       emoji: "🚛", zorluk: "kolay" },

  // ── G ────────────────────────────────────────────────────────
  { id: 81, kibrisca: "Gargara yapmak",  anlam: "Ağızda su çalkalamak",                        cumle: "Sabah kalktın gargara yaptın mı?",                   kategori: "günlük",     emoji: "💧", zorluk: "kolay" },
  { id: 82, kibrisca: "Garyola",         anlam: "Yatak",                                        cumle: "Garyolaya uzanıp dinlendi biraz",                    kategori: "günlük",     emoji: "🛏️", zorluk: "kolay" },
  { id: 83, kibrisca: "Galles",          anlam: "Kalleş, sözünde durmayan",                    cumle: "O galles adamın sözü tutulmaz",                      kategori: "argo",       emoji: "😈", zorluk: "kolay" },
  { id: 84, kibrisca: "Galif",           anlam: "Dam üstüne kurulan baraka veya sundurma",      cumle: "Galife çıkıp havayı seyrettik",                      kategori: "mekan",      emoji: "🏚️", zorluk: "zor"   },
  { id: 85, kibrisca: "Gabbar",          anlam: "Kapari",                                       cumle: "Gabbar turşusu yaptım bu sene",                      kategori: "yemek",      emoji: "🌿", zorluk: "orta"  },
  { id: 86, kibrisca: "Gancelli",        anlam: "Bahçe kapısı",                                 cumle: "Gancelliye kilit vur da hayvan girmesin",            kategori: "mekan",      emoji: "🚪", zorluk: "orta"  },
  { id: 87, kibrisca: "Gakgalli",        anlam: "Sümük",                                        cumle: "Gakgallini sil de gel öyle",                         kategori: "argo",       emoji: "🤧", zorluk: "kolay" },
  { id: 88, kibrisca: "Garacocco",       anlam: "Siyah susam",                                  cumle: "Garacocco ekmeğin üstüne güzel gider",               kategori: "yemek",      emoji: "🌱", zorluk: "zor"   },
  { id: 89, kibrisca: "Gavvolem",        anlam: "Allah kahretsin (küfür/beddua)",               cumle: "Gavvolem bu işlere, bir türlü bitmedi",              kategori: "deyim",      emoji: "😡", zorluk: "kolay" },
  { id: 90, kibrisca: "Gabira",          anlam: "Kızarmış ekmek, tost",                         cumle: "Sabah gabira yaptım peynirle",                       kategori: "yemek",      emoji: "🍞", zorluk: "kolay" },
  { id: 91, kibrisca: "Gadef",           anlam: "Kadeh",                                        cumle: "Bir gadef zivaniya iç de ısın",                      kategori: "günlük",     emoji: "🥂", zorluk: "kolay" },
  { id: 92, kibrisca: "Gave",            anlam: "Kahve",                                        cumle: "Gave içmeden yola çıkılmaz",                         kategori: "yemek",      emoji: "☕", zorluk: "kolay" },
  { id: 93, kibrisca: "Gavro",           anlam: "Yengeç veya İngiliz anahtarı",                 cumle: "Gavroyu ver de boruyu sıkayım",                      kategori: "alet",       emoji: "🔧", zorluk: "zor"   },
  { id: 94, kibrisca: "Gabal",           anlam: "Durmaksızın, sürekli",                         cumle: "Gabal konuşuyor dinleyen yok",                       kategori: "günlük",     emoji: "⏩", zorluk: "orta"  },
  { id: 95, kibrisca: "Garavulli",       anlam: "Salyangoz",                                    cumle: "Garavulli yağmur yağınca çıkar",                     kategori: "doğa",       emoji: "🐌", zorluk: "kolay" },
  { id: 96, kibrisca: "Gatsavida",       anlam: "Tornavida",                                    cumle: "Gatsavida nereye koydum bir türlü bulamıyorum",      kategori: "alet",       emoji: "🪛", zorluk: "kolay" },
  { id: 97, kibrisca: "Gapbella",        anlam: "Bere, takke",                                  cumle: "Gapbellani tak soğuk var",                           kategori: "günlük",     emoji: "🧢", zorluk: "kolay" },
  { id: 98, kibrisca: "Gatsot",          anlam: "Cimri, pinti",                                 cumle: "O gatsot bir kuruş harcamaz",                        kategori: "argo",       emoji: "💰", zorluk: "kolay" },
  { id: 99, kibrisca: "Glaç",            anlam: "Debriyaj",                                     cumle: "Glaça bas yavaş yavaş bırak",                        kategori: "araç",       emoji: "🚗", zorluk: "orta"  },
  { id: 100,kibrisca: "Gorniz",          anlam: "Korniş, kenar süs",                            cumle: "Gornizboya yapmak lazım",                            kategori: "mekan",      emoji: "🏙️", zorluk: "zor"   },
  { id: 101,kibrisca: "Goncoloz",        anlam: "Canavar, korkunç şey veya kişi",               cumle: "O goncoloz komşu yine bağırdı",                      kategori: "günlük",     emoji: "👹", zorluk: "kolay" },
  { id: 102,kibrisca: "Golo",            anlam: "Kıç, popo (kaba)",                             cumle: "Golonu kaldır oturuyorsun yerde",                    kategori: "argo",       emoji: "🍑", zorluk: "kolay" },
  { id: 103,kibrisca: "Gologas",         anlam: "Kökü pişirilip yenen Kıbrıs bitkisi",          cumle: "Gologas yemeği bugün yapıyoruz",                     kategori: "yemek",      emoji: "🌿", zorluk: "zor"   },
  { id: 104,kibrisca: "Golla",           anlam: "Tutkal, yapıştırıcı",                          cumle: "Gollayla yap yapıştır kırılan yeri",                 kategori: "alet",       emoji: "🔧", zorluk: "kolay" },
  { id: 105,kibrisca: "Gollifa",         anlam: "Susam, badem, üzüm, narla haşlanmış buğday",  cumle: "Gollifa bayramlarda yapılır",                        kategori: "yemek",      emoji: "🌾", zorluk: "zor"   },
  { id: 106,kibrisca: "Golyandro",       anlam: "Güzel kokulu tohumlu bitki (kişniş gibi)",     cumle: "Golyandro atarsan yemeğe kokusu güzel olur",         kategori: "doğa",       emoji: "🌿", zorluk: "zor"   },
  { id: 107,kibrisca: "Gonga",           anlam: "Konken (kâğıt oyunu)",                         cumle: "Akşam gonga oynayacağız, sen de gel",                kategori: "kültür",     emoji: "🃏", zorluk: "zor"   },
  { id: 108,kibrisca: "Govcalamak",      anlam: "Kovalamak, peşinden koşmak",                  cumle: "Köpek govcaladı bizi tarlada",                       kategori: "günlük",     emoji: "🏃", zorluk: "orta"  },
  { id: 109,kibrisca: "Golifa zannetding galiba", anlam: "Kolay sandın galiba",                 cumle: "Golifa zannetding galiba bu işi",                    kategori: "deyim",      emoji: "😏", zorluk: "orta"  },
  { id: 110,kibrisca: "Göyver",          anlam: "Koy ver, bırak",                               cumle: "Göyver onu, ne olacak ki",                           kategori: "günlük",     emoji: "🤲", zorluk: "kolay" },
  { id: 111,kibrisca: "Gocagari",        anlam: "Yaşlı kadın",                                  cumle: "Gocagari komşu her gün gelir sohbet eder",           kategori: "günlük",     emoji: "👵", zorluk: "orta"  },
  { id: 112,kibrisca: "Gindirik",        anlam: "Aralıklı, yarı açık",                          cumle: "Kapıyı gindirik bırak hava girsin",                  kategori: "günlük",     emoji: "🚪", zorluk: "zor"   },
  { id: 113,kibrisca: "Girmizilik",      anlam: "Ruj, dudak boyası",                            cumle: "Girmizilik sürdün mü gözlerin çekiyor",              kategori: "günlük",     emoji: "💄", zorluk: "kolay" },
  { id: 114,kibrisca: "Gilli",           anlam: "Erkek eşek",                                   cumle: "Gilli yükü taşıdı tarladan",                         kategori: "doğa",       emoji: "🫏", zorluk: "orta"  },
  { id: 115,kibrisca: "Giksi",           anlam: "Atmaca, yırtıcı kuş",                          cumle: "Giksi tavukların üstüne uçtu",                       kategori: "doğa",       emoji: "🦅", zorluk: "zor"   },
  { id: 116,kibrisca: "Gıccatcık",       anlam: "Kızcağız, küçük kız",                          cumle: "O gıccatcık ne güzel büyümüş",                       kategori: "günlük",     emoji: "👧", zorluk: "orta"  },
  { id: 117,kibrisca: "Gel be bura",     anlam: "Hemen buraya gel",                             cumle: "Gel be bura bir şey soracağım",                      kategori: "deyim",      emoji: "👉", zorluk: "kolay" },
  { id: 118,kibrisca: "Gusbo",           anlam: "Kazma, kürek",                                 cumle: "Gusboyu al bahçeyi kazalım",                         kategori: "alet",       emoji: "⛏️", zorluk: "kolay" },
  { id: 119,kibrisca: "Guli",            anlam: "Yavru köpek",                                  cumle: "Guli sokağa kaçmış, tut onu",                        kategori: "doğa",       emoji: "🐶", zorluk: "kolay" },
  { id: 120,kibrisca: "Gurgura",         anlam: "Boğaz, gırtlak",                               cumle: "Gurguram ağrıyor, soğuk aldım galiba",               kategori: "günlük",     emoji: "🗣️", zorluk: "orta"  },
  { id: 121,kibrisca: "Gulumbra",        anlam: "Kara turp veya bir tür lahana",                cumle: "Gulumbra salatası çok sağlıklıdır",                  kategori: "yemek",      emoji: "🥬", zorluk: "zor"   },
  { id: 122,kibrisca: "Genne",           anlam: "Kendine, kendin için",                         cumle: "Genne bak önce, sonra başkasını eleştir",            kategori: "günlük",     emoji: "👤", zorluk: "orta"  },
  { id: 123,kibrisca: "Guduru",          anlam: "Ezbere, kontrolsüz, rastgele",                 cumle: "Guduru konuşma, düşün önce",                         kategori: "günlük",     emoji: "🎲", zorluk: "orta"  },
  { id: 124,kibrisca: "Guello",          anlam: "Aptal, ahmak",                                 cumle: "Sen nasıl guello birisin ya",                        kategori: "argo",       emoji: "🤦", zorluk: "kolay" },
  { id: 125,kibrisca: "Gulliri",         anlam: "Yuvarlak çörek veya halka şeklindeki şeyler", cumle: "Gulliri aldım fırından, sıcak sıcak",                kategori: "yemek",      emoji: "🍩", zorluk: "orta"  },
  { id: 126,kibrisca: "Guno",            anlam: "Aptal, beyinsiz",                              cumle: "Guno herif, bir türlü anlamıyor",                    kategori: "argo",       emoji: "🧠", zorluk: "kolay" },
  { id: 127,kibrisca: "Gurkuda",         anlam: "Büyük duvar kertenkelesi veya yaşlı korkutucu kişi", cumle: "Gurkuda çıkmış duvara, korktu çocuklar",      kategori: "doğa",       emoji: "🦎", zorluk: "zor"   },

  // ── H ────────────────────────────────────────────────────────
  { id: 128,kibrisca: "Hasba çıkar",     anlam: "Kes sesini, çek git",                          cumle: "Hasba çıkar oradan, bıktım",                         kategori: "deyim",      emoji: "🤐", zorluk: "kolay" },
  { id: 129,kibrisca: "Harnip",          anlam: "Keçiboynuzu",                                  cumle: "Harnip toplayacağız dağda yarın",                    kategori: "yemek",      emoji: "🌿", zorluk: "orta"  },
  { id: 130,kibrisca: "Hade",            anlam: "Hadi, haydi",                                  cumle: "Hade gidelim geç kalıyoruz",                         kategori: "ünlem",      emoji: "➡️", zorluk: "kolay" },
  { id: 131,kibrisca: "Haçan da",        anlam: "Ne kadar çabuk, bak ne kadar hızlı",           cumle: "Haçan da bitirdin yemeği",                           kategori: "deyim",      emoji: "⚡", zorluk: "orta"  },
  { id: 132,kibrisca: "Haçana beş?",     anlam: "Kaç kere, kaç defa?",                          cumle: "Haçana beş söyledim bunu sana",                      kategori: "deyim",      emoji: "❓", zorluk: "orta"  },
  { id: 133,kibrisca: "Haksilo",         anlam: "Kes sesini, kapa çeneni",                      cumle: "Haksilo artık, herkes duydu",                        kategori: "deyim",      emoji: "🤐", zorluk: "kolay" },
  { id: 134,kibrisca: "Hacina",          anlam: "Araç, vasıta",                                 cumle: "Hacinan bozulmuş, tamirciye gidecek",                kategori: "araç",       emoji: "🚗", zorluk: "zor"   },
  { id: 135,kibrisca: "Hollo",           anlam: "Hayalet veya ahmak biri",                      cumle: "O hollo ne yapıyor orada?",                          kategori: "günlük",     emoji: "👻", zorluk: "orta"  },

  // ── I ────────────────────────────────────────────────────────
  { id: 136,kibrisca: "Ispaho",          anlam: "İnce ip, sicim",                               cumle: "Ispaho ile bağla düşmesin",                          kategori: "alet",       emoji: "🧵", zorluk: "orta"  },
  { id: 137,kibrisca: "Isbano",          anlam: "Köse, sakalı olmayan",                         cumle: "Isbano delikanlı sakal bırakmaz mı?",                kategori: "günlük",     emoji: "🧔", zorluk: "orta"  },
  { id: 138,kibrisca: "Isbasdra",        anlam: "İskambil kağıdı veya kâğıt oyunu",             cumle: "Isbasdra oynayacak mısınız bu akşam?",               kategori: "kültür",     emoji: "🃏", zorluk: "orta"  },
  { id: 139,kibrisca: "Isgonto",         anlam: "Ucuzluk, indirim",                             cumle: "Isgontoda aldım, yarı fiyatına",                     kategori: "günlük",     emoji: "💸", zorluk: "orta"  },
  { id: 140,kibrisca: "Isbirto",         anlam: "Kibrit veya saf alkol",                        cumle: "Isbirto ver de mangalı yakalım",                     kategori: "alet",       emoji: "🔥", zorluk: "kolay" },
  { id: 141,kibrisca: "Isdavroz",        anlam: "Haç (cross), çarpı işareti",                   cumle: "Kilisede isdavroz çıktı",                            kategori: "kültür",     emoji: "✝️", zorluk: "orta"  },

  // ── K ────────────────────────────────────────────────────────
  { id: 142,kibrisca: "Kakdirmak",       anlam: "İtmek, itmek",                                 cumle: "Beni kakdirme, yerinden oynamam",                    kategori: "günlük",     emoji: "👉", zorluk: "kolay" },
  { id: 143,kibrisca: "Kakma",           anlam: "Tekme, çifte",                                 cumle: "Kakma attı arabaya kızgınlıktan",                    kategori: "günlük",     emoji: "🦵", zorluk: "kolay" },
  { id: 144,kibrisca: "Kerata",          anlam: "Yaramaz çocuk, haybeci",                       cumle: "Kerata yine bahçeye girip meyve aldı",               kategori: "günlük",     emoji: "😈", zorluk: "kolay" },
  { id: 145,kibrisca: "Küllüm",          anlam: "Topluca, hep beraber",                         cumle: "Küllüm geldik, yer yetmedi",                         kategori: "günlük",     emoji: "👥", zorluk: "orta"  },

  // ── L ────────────────────────────────────────────────────────
  { id: 146,kibrisca: "Lapsana",         anlam: "Yabani yenilebilir çiçekli ot",                cumle: "Lapsana topladık dağdan, kavurma yaptık",            kategori: "doğa",       emoji: "🌼", zorluk: "zor"   },
  { id: 147,kibrisca: "Laşga",           anlam: "Gevşek, sarkık, sıkı olmayan",                 cumle: "Laşga durma, dik dur",                               kategori: "günlük",     emoji: "😴", zorluk: "orta"  },
  { id: 148,kibrisca: "Lamarina",        anlam: "Sac, metal levha",                             cumle: "Lamarina keseceğiz çatıya",                          kategori: "alet",       emoji: "🔩", zorluk: "kolay" },
  { id: 149,kibrisca: "Lamicana",        anlam: "Su şişesi, matara",                            cumle: "Lamicana doldur da yanına al",                       kategori: "alet",       emoji: "🍶", zorluk: "kolay" },
  { id: 150,kibrisca: "Lera",            anlam: "Pis, kirli",                                   cumle: "Lera elleri yıka gel sofraya",                       kategori: "argo",       emoji: "🤢", zorluk: "kolay" },
  { id: 151,kibrisca: "Lenger",          anlam: "Kova",                                         cumle: "Lengeri doldur su getir",                            kategori: "alet",       emoji: "🪣", zorluk: "kolay" },
  { id: 152,kibrisca: "Leymonatda",      anlam: "Limonata",                                     cumle: "Leymonatda içtik yazın sıcağında",                   kategori: "yemek",      emoji: "🍋", zorluk: "kolay" },
  { id: 153,kibrisca: "Letsa",           anlam: "Vücutta istenmeyen yağ",                       cumle: "Letsa bağladım, spor yapacağım",                     kategori: "günlük",     emoji: "💪", zorluk: "orta"  },
  { id: 154,kibrisca: "Lingiri",         anlam: "Değneklerle oynanan geleneksel oyun",          cumle: "Lingiri oynardık sokakta çocukken",                  kategori: "kültür",     emoji: "🪄", zorluk: "zor"   },
  { id: 155,kibrisca: "Loddo",           anlam: "Aşırı şişman kişi",                            cumle: "Loddo herif kapıya sığmadı",                         kategori: "argo",       emoji: "😅", zorluk: "orta"  },
  { id: 156,kibrisca: "Lollo",           anlam: "Soytarı, aptal",                               cumle: "Lollo gibi gülüyor dur",                             kategori: "argo",       emoji: "🤡", zorluk: "kolay" },
  { id: 157,kibrisca: "Lux",             anlam: "Gaz lambası veya elektrikli ışıldak",          cumle: "Luxi yak, ışık kesildi",                             kategori: "alet",       emoji: "🔦", zorluk: "orta"  },

  // ── M ────────────────────────────────────────────────────────
  { id: 158,kibrisca: "Maksıl",          anlam: "Mahsul, hasat",                                cumle: "Bu sene maksıl bol, şükür",                          kategori: "günlük",     emoji: "🌾", zorluk: "orta"  },
  { id: 159,kibrisca: "Ma",              anlam: "Bu arada, aslında, ya (başlangıç sözü)",       cumle: "Ma nereye gidiyordun bu saatte?",                    kategori: "ünlem",      emoji: "💬", zorluk: "kolay" },
  { id: 160,kibrisca: "Managül",         anlam: "Oje, tırnak boyası",                           cumle: "Managül sürdü tırnaklarına",                         kategori: "günlük",     emoji: "💅", zorluk: "kolay" },
  { id: 161,kibrisca: "Mandıra",         anlam: "Üstü kapalı ahır",                             cumle: "Keçiler mandırada yatıyor",                          kategori: "mekan",      emoji: "🐐", zorluk: "orta"  },
  { id: 162,kibrisca: "Mangos",          anlam: "Hiddetli, sinirli, öfkeli",                    cumle: "Mangos geldi, kızdı bir şeye",                       kategori: "günlük",     emoji: "😠", zorluk: "orta"  },
  { id: 163,kibrisca: "Magarına bulli",  anlam: "Makarna ve tavuk yemeği",                      cumle: "Magarına bulli yapacağım öğleden sonra",             kategori: "yemek",      emoji: "🍝", zorluk: "kolay" },
  { id: 164,kibrisca: "Macun",           anlam: "Reçel",                                        cumle: "Sabah ekmeğe macun sürdüm",                          kategori: "yemek",      emoji: "🍯", zorluk: "kolay" },
  { id: 165,kibrisca: "Marmaragi",       anlam: "Mermer",                                       cumle: "Zemin marmaragidir, çok soğuk",                      kategori: "günlük",     emoji: "🪨", zorluk: "zor"   },
  { id: 166,kibrisca: "Mısmıl",          anlam: "Kaliteli, sağlam, yerli yerinde",              cumle: "Mısmıl iş çıkardı, aferin",                         kategori: "günlük",     emoji: "💎", zorluk: "orta"  },
  { id: 167,kibrisca: "Mişaro",          anlam: "Kertenkele",                                   cumle: "Mişaro çıktı duvarda güneşleniyor",                  kategori: "doğa",       emoji: "🦎", zorluk: "orta"  },
  { id: 168,kibrisca: "Manamu",          anlam: "Zavallım, acıma ifadesi",                      cumle: "Manamu hasta olmuş, geçmiş olsun",                   kategori: "sevgi",      emoji: "🥺", zorluk: "kolay" },
  { id: 169,kibrisca: "Mücendra",        anlam: "Yeşil mercimekli pilav",                       cumle: "Mücendra bugün yaptım, çok lezzetli",                kategori: "yemek",      emoji: "🍚", zorluk: "zor"   },

  // ── N ────────────────────────────────────────────────────────
  { id: 170,kibrisca: "Napang?",         anlam: "Nasılsın? Ne var ne yok?",                     cumle: "Napang, çoktandır görüşmedik",                       kategori: "ünlem",      emoji: "🙋", zorluk: "kolay" },

  // ── O ────────────────────────────────────────────────────────
  { id: 171,kibrisca: "Oraşda",          anlam: "Orada",                                        cumle: "Oraşda dur, gelmiyorum",                             kategori: "günlük",     emoji: "📍", zorluk: "kolay" },
  { id: 172,kibrisca: "Osdo yüro",       anlam: "Etrafında durmadan dönmek",                    cumle: "Osdo yüro durmuyor, beni başım döndürüyor",          kategori: "deyim",      emoji: "🔄", zorluk: "orta"  },

  // ── Ö ────────────────────────────────────────────────────────
  { id: 173,kibrisca: "Ötegü gün",       anlam: "Önceki gün, dünün dünü",                       cumle: "Ötegü gün seni aradım evde yoktun",                  kategori: "günlük",     emoji: "📅", zorluk: "kolay" },

  // ── P ────────────────────────────────────────────────────────
  { id: 174,kibrisca: "Pataniya",        anlam: "Battaniye",                                    cumle: "Pataniyeyi al soğuk var",                            kategori: "günlük",     emoji: "🛌", zorluk: "kolay" },
  { id: 175,kibrisca: "Pasedembo",       anlam: "Kabak çekirdeği",                              cumle: "Pasedembo çıtlatırken film izledik",                 kategori: "yemek",      emoji: "🌰", zorluk: "kolay" },
  { id: 176,kibrisca: "Paneri",          anlam: "Hasırdan yapılmış yerel tepsi",                cumle: "Panerde kurutuyorlar incirleri",                     kategori: "kültür",     emoji: "🧺", zorluk: "orta"  },
  { id: 177,kibrisca: "Pasdelli",        anlam: "Susamlı ve ballı kuru tatlı",                  cumle: "Pasdelli kesmeden düğün olmaz",                      kategori: "yemek",      emoji: "🍯", zorluk: "orta"  },
  { id: 178,kibrisca: "Patariya",        anlam: "Pil veya araba aküsü",                        cumle: "Patariva bitti, telefon kapandı",                    kategori: "alet",       emoji: "🔋", zorluk: "kolay" },
  { id: 179,kibrisca: "Penna",           anlam: "Tükenmez kalem",                               cumle: "Pennayı ver bir şey yazacağım",                      kategori: "alet",       emoji: "✏️", zorluk: "kolay" },
  { id: 180,kibrisca: "Perisgan",        anlam: "Suyla karıştırılıp içilen sodalı toz",         cumle: "Perisgan iç misin, karnın şişkinse iyi gelir",       kategori: "yemek",      emoji: "🥤", zorluk: "orta"  },
  { id: 181,kibrisca: "Pilavuna",        anlam: "Peynir ve kuru üzümlü börek",                  cumle: "Pilavuna yaparken lor peyniri kullan",               kategori: "yemek",      emoji: "🥟", zorluk: "orta"  },
  { id: 182,kibrisca: "Pirilli",         anlam: "Misket, bilye",                                cumle: "Pirilli oynadık avluda çocukken",                    kategori: "kültür",     emoji: "⚪", zorluk: "kolay" },
  { id: 183,kibrisca: "Pirohu",          anlam: "Kıbrıs usulü peynirli börek",                  cumle: "Pirohu yap öğlene, bayıldım buna",                   kategori: "yemek",      emoji: "🥟", zorluk: "orta"  },
  { id: 184,kibrisca: "Piron",           anlam: "Çatal",                                        cumle: "Pironu masaya koy, yemek hazır",                     kategori: "günlük",     emoji: "🍴", zorluk: "kolay" },
  { id: 185,kibrisca: "Piskot",          anlam: "Bisküvi",                                      cumle: "Piskot ver çaya bandırayım",                         kategori: "yemek",      emoji: "🍪", zorluk: "kolay" },
  { id: 186,kibrisca: "Pesgir",          anlam: "Havlu",                                        cumle: "Pesgiri al elini sil",                               kategori: "günlük",     emoji: "🧴", zorluk: "kolay" },
  { id: 187,kibrisca: "Potin",           anlam: "Ayakkabı, bot",                                cumle: "Potinleri çıkar içeri girme",                        kategori: "günlük",     emoji: "👟", zorluk: "kolay" },
  { id: 188,kibrisca: "Pünez",           anlam: "Raptiye",                                      cumle: "Pünezle yapıştırdım kağıdı duvara",                  kategori: "alet",       emoji: "📌", zorluk: "kolay" },
  { id: 189,kibrisca: "Pensa",           anlam: "Kerpeten, pense",                              cumle: "Pensayı al şu çiviyi çıkar",                         kategori: "alet",       emoji: "🔧", zorluk: "orta"  },

  // ── R ────────────────────────────────────────────────────────
  { id: 190,kibrisca: "Renga",           anlam: "Kokulu ringa balığı",                          cumle: "Renga ile patates harika gider",                     kategori: "yemek",      emoji: "🐟", zorluk: "zor"   },

  // ── S ────────────────────────────────────────────────────────
  { id: 191,kibrisca: "Seki",            anlam: "Basamak, merdiven kademesi",                   cumle: "Sekiden düştüm, ayağım burkuldu",                    kategori: "mekan",      emoji: "🪜", zorluk: "kolay" },
  { id: 192,kibrisca: "Sakgulli",        anlam: "Torba, bez çanta",                             cumle: "Sakgulliye koy pazardan aldıklarını",                kategori: "alet",       emoji: "🛍️", zorluk: "kolay" },
  { id: 193,kibrisca: "Sakgo",           anlam: "Ceket, mont",                                  cumle: "Sakgoyu giy soğuk var dışarısı",                     kategori: "günlük",     emoji: "🧥", zorluk: "kolay" },
  { id: 194,kibrisca: "Solina",          anlam: "Boru, tüp",                                    cumle: "Solina patlamış su taşıyor",                         kategori: "alet",       emoji: "🔩", zorluk: "orta"  },
  { id: 195,kibrisca: "Susta",           anlam: "Yay, yaylanma mekanizması",                    cumle: "Koltuk sustası kırılmış, geveşek",                   kategori: "alet",       emoji: "🌀", zorluk: "orta"  },
  { id: 196,kibrisca: "Siribilla",       anlam: "Tavuk iç organı, ciğer karışımı",              cumle: "Siribilla kavurması yaptım akşam",                   kategori: "yemek",      emoji: "🍗", zorluk: "zor"   },
  { id: 197,kibrisca: "Stekka",          anlam: "Bilardo sopası",                               cumle: "Stekkayla oynadık akşam meyhane de",                 kategori: "kültür",     emoji: "🎱", zorluk: "orta"  },
  { id: 198,kibrisca: "Stokko",          anlam: "Cam çerçevesinde kullanılan yapışkan macun",   cumle: "Stokko ile sızdırmaz hale getirdik camı",            kategori: "alet",       emoji: "🪟", zorluk: "zor"   },

  // ── Ş ────────────────────────────────────────────────────────
  { id: 199,kibrisca: "Şafk",            anlam: "Işık, aydınlık",                               cumle: "Şafk yakmadan geldin mi içeri?",                     kategori: "günlük",     emoji: "💡", zorluk: "kolay" },
  { id: 200,kibrisca: "Şiro",            anlam: "Kepçeli buldozer, iş makinesi",                cumle: "Şiro geldi yolu düzledi",                            kategori: "araç",       emoji: "🚧", zorluk: "orta"  },

  // ── T ────────────────────────────────────────────────────────
  { id: 201,kibrisca: "Tapba lamarina",  anlam: "Çok hızlı giden araç",                         cumle: "Tapba lamarina geçti orda, gördün mü?",              kategori: "deyim",      emoji: "🚀", zorluk: "orta"  },
  { id: 202,kibrisca: "Tayka",           anlam: "Dakika",                                       cumle: "Bir tayka bekle, geliyorum",                         kategori: "günlük",     emoji: "⏰", zorluk: "kolay" },
  { id: 203,kibrisca: "Tekne",           anlam: "Evye, bulaşık teknesi",                        cumle: "Tekneye koy bulaşıkları yıkayacağım",                kategori: "günlük",     emoji: "🚿", zorluk: "kolay" },
  { id: 204,kibrisca: "Trabez",          anlam: "Yemek masası",                                 cumle: "Trabezi topla yemek hazır",                          kategori: "günlük",     emoji: "🪑", zorluk: "kolay" },

  // ── V ────────────────────────────────────────────────────────
  { id: 205,kibrisca: "Van",             anlam: "Kamyonet, minibüs",                            cumle: "Vanla taşıdık mobilyaları",                          kategori: "araç",       emoji: "🚐", zorluk: "kolay" },
  { id: 206,kibrisca: "Vordo Vosgo Guello", anlam: "Tam bir aptal (kuvvetli argo)",            cumle: "Vordo vosgo guello bir iş çıkardı",                  kategori: "argo",       emoji: "🤦", zorluk: "orta"  },
  { id: 207,kibrisca: "Valvid",          anlam: "Valf, subap, kapak",                           cumle: "Valvid kapandı su gelmiyor",                         kategori: "alet",       emoji: "🔩", zorluk: "zor"   },
  { id: 208,kibrisca: "Virra",           anlam: "Devamlı, duraksız, sürekli",                   cumle: "Virra yağıyor, çıkamayız",                           kategori: "günlük",     emoji: "▶️", zorluk: "kolay" },

  // ── Y ────────────────────────────────────────────────────────
  { id: 209,kibrisca: "Yusufcuk",        anlam: "Mandalina",                                    cumle: "Yusufcuk sezonu geldi, bahçeden topla",              kategori: "yemek",      emoji: "🍊", zorluk: "kolay" },
  { id: 210,kibrisca: "Yüro",            anlam: "Dairesel tur atmak, etrafında dönmek",         cumle: "Yüro yüro yoruldum, dur biraz",                      kategori: "günlük",     emoji: "🔄", zorluk: "kolay" },

  // ── Z ────────────────────────────────────────────────────────
  { id: 211,kibrisca: "Zeflemek",        anlam: "Alay etmek, dalga geçmek",                    cumle: "Zefleme onunla, kızar",                              kategori: "günlük",     emoji: "😂", zorluk: "kolay" },
  { id: 212,kibrisca: "Ziligurti",       anlam: "Kes sesini, sus",                              cumle: "Ziligurti artık, yeter",                             kategori: "deyim",      emoji: "🤐", zorluk: "kolay" },
  { id: 213,kibrisca: "Zibil",           anlam: "Çöp",                                          cumle: "Zibili dışarı çıkar kokulmuş",                       kategori: "günlük",     emoji: "🗑️", zorluk: "kolay" },
  { id: 214,kibrisca: "Zivaniya",        anlam: "Üzümden yapılan yüksek alkollü Kıbrıs içkisi", cumle: "Zivaniya içtik, başım döndü",                       kategori: "yemek",      emoji: "🥃", zorluk: "orta"  },
];

export const kategoriler = [
  "günlük", "argo", "deyim", "anlam farkı", "ünlem",
  "yemek", "kültür", "sevgi", "doğa", "alet", "araç", "mekan",
] as const;

export type Kategori = (typeof kategoriler)[number];
