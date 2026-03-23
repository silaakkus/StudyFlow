# Minimum Acceptance Test Package

Bu kontrol listesi `T064` kabul paketi olarak kullanilir.

## Kriterler
- [ ] En az 2 farkli ders icin plan olusturulur
- [ ] Plan oturumlari saat cakismasi olmadan listelenir
- [ ] Google/ICS tarafinda en az 5 etkinlik export senaryosu dogrulanir
- [ ] YouTube onerisi en az 3 farkli kanal senaryosunda dogrulanir
- [ ] Mobil gorunumde dashboard ana akislari calisir

## Komutlar
- `npm run lint`
- `npm run test:e2e -- --list`
- `npm run perf:check` (dev server acikken)
