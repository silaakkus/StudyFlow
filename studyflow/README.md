# StudyFlow

Akilli ogrenci planlayici ve stratejik calisma asistani.

## Kurulum

1. Bagimliliklari yukle:
```bash
npm install
```
2. Ortam dosyasini hazirla:
```bash
cp .env.example .env
```
3. Veritabani migration calistir:
```bash
npm run db:migrate
```
4. Uygulamayi baslat:
```bash
npm run dev
```

## MVP Ozellikleri

- Sinav + konu ekleme
- Dinamik geri sayim ve acil durum uyarisi
- Otomatik plan olusturma (oncelik + deadline entegrasyonu)
- YouTube kanal beyaz listesi + konu bazli video arama
- Videoyu calisma seansina baglama
- ICS export ve Google Takvim aktarimi
- Google OAuth giris

## Yararlı Komutlar

- `npm run lint`
- `npm run db:generate`
- `npm run db:studio`
- `npm run test:e2e -- --list`
- `npm run perf:check`
- `npm run test:acceptance`

## Standartlar ve Kararlar

- Storage karari: `docs/adr/0001-storage-strategy.md`
- Teknoloji yigini karari: `docs/adr/0002-tech-stack.md`
- Performans butcesi: `performance-budget.json`
- Minimum kabul test paketi: `docs/testing/minimum-acceptance-checklist.md`
