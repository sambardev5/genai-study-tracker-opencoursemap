# Ingestion

The ingestion framework is intentionally allowlist-only.

Implemented pieces:

- `SourceAdapter` interface in `lib/ingestion/adapters/types.ts`
- `manualAdapter`
- `rssAdapter`
- `sitemapAdapter`
- `htmlAllowlistedAdapter`
- deterministic topic classifier in `lib/ingestion/classifiers/topic-classifier.ts`
- baseline verification helper in `lib/ingestion/verifiers/basic-verifier.ts`

Current gaps:

- no live network fetches are performed in the local repository layer
- no persistence from candidate approval into real `resources` / `courses` tables yet
- edge functions are placeholders and need Supabase wiring

This still gives the project a concrete connector shape and review workflow aligned with the spec.
