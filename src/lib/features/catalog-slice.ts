import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCatalogList } from "@/lib/catalog/api";
import type { PublicListResult } from "@/lib/catalog/public";
import type { PublicQuery } from "@/lib/catalog/url";

export interface CatalogState {
  query: PublicQuery;
  result: PublicListResult | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filtersOpen: boolean;
  requestId: string | null;
}

const initialState: CatalogState = { query: {}, result: null, status: "idle", error: null, filtersOpen: false, requestId: null };

export const loadCatalog = createAsyncThunk("catalog/load", (q: PublicQuery, { signal }) => fetchCatalogList(q, signal));

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    hydrateCatalog(state, action: PayloadAction<{ query: PublicQuery; result: PublicListResult }>) {
      state.query = action.payload.query;
      state.result = action.payload.result;
      state.status = "succeeded";
      state.error = null;
    },
    setFiltersOpen(state, action: PayloadAction<boolean>) {
      state.filtersOpen = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadCatalog.pending, (state, action) => {
      state.query = action.meta.arg;
      state.status = "loading";
      state.error = null;
      state.requestId = action.meta.requestId;
    })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.result = action.payload;
        state.status = "succeeded";
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId || action.meta.aborted) return;
        state.status = "failed";
        state.error = action.error.message ?? "Could not load products";
      });
  },
});

export const { hydrateCatalog, setFiltersOpen } = catalogSlice.actions;
