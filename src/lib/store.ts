import { configureStore } from "@reduxjs/toolkit";
import { catalogSlice } from "./features/catalog-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      catalog: catalogSlice.reducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
