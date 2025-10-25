# Unified Movie Search Objective

Deliver a responsive, unified movie search experience that:
- Centralizes filtering through a single server action (`searchMoviesFiltered`) and shared filter context.
- Preserves the existing `FilterBar` UI while adding actor-based filtering, URL sync, and locale-aware data.
- Provides modal (desktop) and drawer (mobile) shells that embed the `MovieSearch` grid and share state.
- Integrates the global `SearchButton` trigger so users can open the modal/drawer from anywhere.
- Remains extensible for future filters (duration, rating thresholds) without schema churn.

Key success signals:
- Strong typing across filters and server action integration (no `any`).
- URL reflects filter state and rehydrates on reload.
- Actor search reliably narrows results using TMDB credits.
- Maintains current performance characteristics (TanStack Query caching, debounced inputs).
