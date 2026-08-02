import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    // Register the RTK Query baseApi reducer
    [baseApi.reducerPath]: baseApi.reducer,
    // Add other slices here (e.g. auth: authReducer, cart: cartReducer)
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Enable listener behavior for the store (required for refetchOnFocus/refetchOnReconnect)
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
