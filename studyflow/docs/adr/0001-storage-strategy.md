# ADR-0001 Storage Strategy

## Status
Accepted

## Context
StudyFlow MVP hizli iterasyon, kolay kurulum ve local calisma hedefliyor.

## Decision
- MVP icin `SQLite + Prisma` secildi.
- Uretim icin hedef: `PostgreSQL (Supabase veya managed Postgres)`.

## Trade-offs
- **Artisi:** Kurulum cok hizli, migration ve local test kolay.
- **Eksisi:** Cok kullanicili uretim senaryosu icin sinirli olcekleme.

## Consequences
- Kod tarafinda Prisma kullanildigi icin PostgreSQL'e gecis maliyeti dusuk.
- Production oncesi `DATABASE_URL` ve migrate pipeline guncellenmeli.
