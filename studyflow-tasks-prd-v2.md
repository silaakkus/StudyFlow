# StudyFlow Task Backlog (PRD v2.0)

Bu dosya, paylastigin PRD iceriginden uretilmis uygulanabilir gorevleri icerir.

## 1) Product Setup & Foundation

### EPIC-01: Proje Kurulumu
- [x] T001 - Next.js + TypeScript projesini olustur
  - Aciklama: Frontend temelini Next.js ile baslat
  - Kabul Kriteri: `npm run dev` ile proje acilir, ana sayfa goruntulenir
- [x] T002 - UI altyapisini kur (Tailwind + temel component yapisi)
  - Aciklama: Responsive ve hizli arayuz gelistirmesi icin temel yapilar
  - Kabul Kriteri: En az 1 layout + 1 reusable kart componenti calisir
- [x] T003 - Backend mimarisini sec ve bootstrapping yap
  - Aciklama: Node.js (Express) veya Firebase secimi ve ilk kurulum
  - Kabul Kriteri: Health endpoint veya test request basarili doner
- [x] T004 - Veritabani semasini olustur (PostgreSQL)
  - Aciklama: User, Exam, Topic, Task, StudySession, Channel tablolari
  - Kabul Kriteri: Migration basariyla calisir, tablolar olusur
- [x] T005 - Google OAuth ile giris altyapisini kur
  - Aciklama: Kimlik dogrulama ve takvim izinleri icin OAuth setup
  - Kabul Kriteri: Kullanici Google ile giris yapabilir

## 2) Core Dashboard Experience

### EPIC-02: Akilli Dashboard
- [x] T006 - Sinav kartlari ve genel dashboard UI
  - Aciklama: Sinavlarin ozet kartlar halinde listelenmesi
  - Kabul Kriteri: En az ad, tarih, kalan sure bilgisi gorunur
- [x] T007 - Dinamik geri sayim widgeti
  - Aciklama: "X Gun Y Saat Kaldi" verisini canli guncelle
  - Kabul Kriteri: Sayaç otomatik yenilenir, negatif deger uretmez
- [x] T008 - Acil durum gostergesi (Hizlanmalisin)
  - Aciklama: Kalan sure / kalan konu oranina gore risk uyarisi
  - Kabul Kriteri: Yetersiz zaman durumunda uyarı gorunur

## 3) Planning Engine

### EPIC-03: Dinamik Planlama Algoritmasi
- [x] T009 - Sinav ekleme akisi
  - Aciklama: Sinav adi, tarihi, ders bilgisi girisi
  - Kabul Kriteri: 60 saniye icinde sinav olusturulabilir
- [x] T010 - Konu listesi giris ve duzenleme
  - Aciklama: Konu ekle/sil/guncelle ve tahmini sure belirtme
  - Kabul Kriteri: Tek sinava en az 5 konu eklenebilir
- [x] T011 - Plan slot modeli tasarimi
  - Aciklama: Gunluk/haftalik slotlarin veri modelini olustur
  - Kabul Kriteri: Slotlar DB'de kaydedilir ve geri okunur
- [x] T012 - Onceliklendirme algoritmasi v1
  - Aciklama: Yaklasan sinavlara daha fazla slot ayiran skor mantigi
  - Kabul Kriteri: Yakın tarihli sinav, daha fazla seans alir
- [x] T013 - Deadline entegrasyonu (tek seferlik gorevler)
  - Aciklama: Odev/proje gorevlerini plan arasina uygun yerlestirme
  - Kabul Kriteri: Deadline taskleri cakisma olmadan takvime girer
- [x] T014 - Plan olusturma servis API'si
  - Aciklama: Inputlari alip otomatik plan ureten endpoint
  - Kabul Kriteri: API, test verisiyle gecerli plan dondurur

## 4) YouTube Smart Search

### EPIC-04: Kaynak Oneri Motoru
- [x] T015 - Kanal beyaz listesi CRUD
  - Aciklama: Favori egitmen/kanal ekleme, silme, guncelleme
  - Kabul Kriteri: Kullanici kendi kanal listesini yonetebilir
- [x] T016 - YouTube API entegrasyonu
  - Aciklama: Konu anahtar kelimesine gore video arama
  - Kabul Kriteri: Gecerli API key ile sonuc listesi doner
- [x] T017 - Kanal filtreleme mantigi
  - Aciklama: Sonuclari sadece beyaz listedeki kanallarla sinirla
  - Kabul Kriteri: Liste disi kanal videolari elenir
- [x] T018 - Calisma kartina video baglama
  - Aciklama: Onerilen videoyu seansa ekleme
  - Kabul Kriteri: Seans detayinda secilen video gorunur
- [x] T019 - Performans hedefi optimizasyonu
  - Aciklama: Oneri sorgularini 3 saniye alti hedefe cek
  - Kabul Kriteri: Ortalama cevap suresi < 3 saniye

## 5) Calendar Integration

### EPIC-05: Takvim ve Paylasim
- [x] T020 - ICS export olusturma
  - Aciklama: Hazirlanan plani `.ics` formatinda disa aktar
  - Kabul Kriteri: Takvim uygulamalarinda hatasiz import edilir
- [x] T021 - Google Calendar API entegrasyonu
  - Aciklama: Tek tikla plana ait eventleri Google Takvim'e yaz
  - Kabul Kriteri: Eventler dogru tarih/saatle olusur
- [x] T022 - Senkronizasyon ayarlari
  - Aciklama: Tek yonlu / cift yonlu sync secenekleri
  - Kabul Kriteri: Secilen moda gore beklenen sync davranisi calisir

## 6) Pro Features (Kidemli Developer Tavsiyeleri)

### EPIC-06: Confidence-Based Planning
- [x] T023 - Konu tamamlama ve anlama seviyesi girisi (1-5)
  - Kabul Kriteri: Tamamlanan konu icin puan zorunlu/secilebilir
- [x] T024 - Dusuk puanli konulara +3 gun tekrar seansi
  - Kabul Kriteri: Puan 1-2 ise otomatik tekrar eklenir

### EPIC-07: Spaced Repetition
- [x] T025 - 1-7-30 gun tekrar kurali motoru
  - Kabul Kriteri: Konu bitince 3 tekrar gorevi takvime eklenir
- [x] T026 - 15 dakikalik hizli hatirlatma bloklari
  - Kabul Kriteri: Tekrar seans suresi varsayilan 15 dk olur

### EPIC-08: Focus Mode (Pomodoro)
- [x] T027 - Odak modu ekrani
  - Kabul Kriteri: UI sade modda dikkat dagitici oge azaltilir
- [x] T028 - 25+5 pomodoro sayaci
  - Kabul Kriteri: Calisma/mola dongusu dogru isler
- [x] T029 - Seans icinde YouTube video oynatma
  - Kabul Kriteri: Odak ekraninda secili video acilir

### EPIC-09: Catch-up Mode
- [x] T030 - "Bugun tamamlayamadim" isaretleme akisi
  - Kabul Kriteri: Kullanici gun sonu taskleri ertelenmis gosterir
- [x] T031 - Kalan yuku sinav tarihine kadar yeniden dagitma
  - Kabul Kriteri: Yeni plan cakisma olmadan olusturulur

## 7) Non-Functional & Quality

### EPIC-10: Kalite, Test, Responsive
- [x] T032 - Mobil responsive duzen
  - Kabul Kriteri: Temel ekranlar mobilde %100 kullanilabilir
- [x] T033 - E2E test senaryolari (MVP akislari)
  - Kabul Kriteri: Sinav ekleme, planlama, takvime aktarim testleri gecer
- [x] T034 - Performans izleme (dashboard + arama)
  - Kabul Kriteri: Kritik metrikler olculur ve raporlanir
- [x] T035 - Hata yonetimi ve kullanici dostu mesajlar
  - Kabul Kriteri: API hatalarinda anlamli geri bildirim gorunur

## 8) MVP Milestone (Oncelikli Siralama)

- [x] M1 - T001, T002, T003, T004, T005
- [x] M2 - T006, T007, T009, T010
- [x] M3 - T011, T012, T013, T014
- [x] M4 - T015, T016, T017, T018, T019
- [x] M5 - T020, T021
- [x] M6 - T032, T033, T035

## 9) PRD Basari Kriteri Eslestirmesi

- 60 sn icinde 1 sinav + 5 konu: T009 + T010
- YouTube onerileri < 3 sn: T016 + T019
- Google Takvim aktarimi hatasiz: T021 (+ T020 fallback)
- Mobilde %100 islevsellik: T032

## 10) PRD-2 Ek Gorevler (v1.0 + detayli modul kapsam)

### EPIC-11: Formlar ve Kullanici Girdisi Derinlestirme
- [x] T036 - Sinav girisi alanlarini genislet (oncelik + max gunluk saat)
  - Kabul Kriteri: Ders adi, sinav tarihi/saati, oncelik, max gunluk saat zorunlu/kuralli calisir
- [x] T037 - Deadline gorev formunu tamamla (tahmini sure + bagli ders)
  - Kabul Kriteri: Gorev formu title, deadline, estimatedHours, linkedExam alanlarini kaydeder
- [x] T038 - Dashboard kart tiklama ile ilgili plana yonlendirme
  - Kabul Kriteri: Sinav/deadline kartina tiklandiginda plan detayina gider

### EPIC-12: Planlama Motoru v2 (Detayli Kurallar)
- [x] T039 - Coklu sinav cakisma dengeleme kurali
  - Kabul Kriteri: Ayni gun/yakin tarihli 2+ sinavda gunluk yuk dengeli dagitilir
- [x] T040 - Haftalik ozet plan gorunumu
  - Kabul Kriteri: Haftalik tabloda ders-konu-sure dagilimi gorunur
- [x] T041 - Oturum duzenleme (konu tasima + sure degistirme)
  - Kabul Kriteri: Kullanici plan uzerinde manuel duzenleme yapabilir
- [x] T042 - Oturum bazli mola onerisi (5 dk)
  - Kabul Kriteri: Her calisma oturumu icin mola bilgisi otomatik olusur

### EPIC-13: YouTube Oneri Sistemi v2
- [x] T043 - Kanal URL veya adindan channelId cozumleme
  - Kabul Kriteri: Girilen kanal metni gecerli ID ile iliskilendirilir
- [x] T044 - Sonuc siralama (izlenme + yakinlik skoru)
  - Kabul Kriteri: Oneri listesi tanimli skora gore siralanir
- [x] T045 - Video kart detaylari (baslik, kanal, sure, thumbnail)
  - Kabul Kriteri: Her sonuc kartinda tum alanlar gorunur
- [x] T046 - Surukle-birak ile seansa video baglama
  - Kabul Kriteri: Video plan oturumuna drag-drop ile eklenir
- [x] T047 - Video suresi > oturum suresi uyarisi
  - Kabul Kriteri: Asim durumunda kullaniciya acik uyari gosterilir
- [x] T048 - YouTube kota yonetimi ve fallback stratejisi
  - Kabul Kriteri: Kota asiminda cache/fallback mekanizmasi devreye girer

### EPIC-14: Google Calendar Entegrasyonu v2
- [x] T049 - Event baslik standardi (`StudyFlow | [Ders] - [Konu]`)
  - Kabul Kriteri: Takvime eklenen etkinlik adlari standart formata uyar
- [x] T050 - Event aciklamasina video linki ve not ekleme
  - Kabul Kriteri: Seans metadata'si aciklamada gorunur
- [x] T051 - Toplu aktarim ("Tum Plani Takvime Ekle")
  - Kabul Kriteri: Tek aksiyonla coklu event olusturulur
- [x] T052 - Tekli seans aktarimi
  - Kabul Kriteri: Kullanici tek bir seansi ayri aktarabilir

### EPIC-15: Bildirim, Uyari ve Telafi
- [x] T053 - Sinav yaklasma bildirimleri (7/3/1 gun)
  - Kabul Kriteri: Tanimli esiklerde tarayici bildirimi tetiklenir
- [x] T054 - Gunluk oturum baslangic hatirlaticisi
  - Kabul Kriteri: Planlanan saate yakin hatirlatma gonderilir
- [x] T055 - Akilli telafi onerisi popup
  - Kabul Kriteri: Eksik tamamlama durumunda "yarin telafi" onerisi cikartir
- [x] T056 - "Kalan sure yetmiyor" erken uyari
  - Kabul Kriteri: Kritik durumda dashboard ve plan ekraninda risk mesaji cikar

### EPIC-16: Analitik ve Ilerleme
- [x] T057 - Haftalik toplam calisma saati grafigi
  - Kabul Kriteri: Son 7 gun toplam suresi grafik olarak gosterilir
- [x] T058 - Ders bazli zaman dagilimi grafigi
  - Kabul Kriteri: Derslerin yuzdesel dagilimi goruntulenir
- [x] T059 - Hedeflenen vs gerceklesen oturum karsilastirmasi
  - Kabul Kriteri: Planlanan/tamamlanan farki net raporlanir
- [x] T060 - Streak (ardisik calisma gunu) sayaci
  - Kabul Kriteri: Kullanici streak degerini dashboard'da gorebilir

### EPIC-17: Teknik Kararlar ve Operasyonel Hazirlik
- [x] T061 - Storage karari kaydi (Supabase vs LocalStorage)
  - Kabul Kriteri: Secenekler, trade-off ve secilen yol ADR dokumanina yazilir
- [x] T062 - Teknoloji yiginini netlestirme (Next.js veya React+Vite)
  - Kabul Kriteri: Tek bir stack secilip repo readme'de standartlastirilir
- [x] T063 - Performans butcesi (ilk yukleme < 3 sn) uygulamasi
  - Kabul Kriteri: Lighthouse/olcum raporunda hedef karsilanir
- [x] T064 - Minimum kabul test paketi (8. madde kriterleri)
  - Kabul Kriteri: 2 ders plansiz cakisma, 5 event aktarim, 3 kanal onerisi testten gecer

## 11) Faz Bazli Yol Haritasi (Guncel)

- [ ] F1 (MVP / 2-3 hafta): T001-T014, T020-T021, T036-T037
- [ ] F2 (Beta / 4-5 hafta): T015-T019, T040, T045-T046, T049-T052
- [ ] F3 (Genisleme / 6+ hafta): T027-T031, T053-T060, T063

## 12) Acik Sorular -> Hazirlama Taskleri

- [ ] Q01 - YouTube kota asiminda urun davranisi
  - Cikti: Teknik karar notu + UI fallback metinleri
- [ ] Q02 - Veri saklama stratejisi (yerel vs sunucu)
  - Cikti: Guvenlik, senkronizasyon ve maliyet karsilastirmasi
- [ ] Q03 - Plan paylasim ozelligi MVP kapsam karari
  - Cikti: MVP kapsam disi/içi karar dokumani
- [ ] Q04 - Outlook/Apple Calendar entegrasyon backlog karari
  - Cikti: Entegrasyon sirasi ve efor tahmini
