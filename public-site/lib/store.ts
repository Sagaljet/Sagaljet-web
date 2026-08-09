// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { clientsApi } from "./features/clients/clientsApi";
import { eventsApi } from "./features/events/eventsApi";
import { designApi } from "./features/designs/designApi";
import { projectsApi } from "./features/projects/project-api";
import { blogsApi } from "./features/blog/blog-api";
import { printingApi } from "./features/printings/printingsApi";
import { categoryApi } from "./features/categories/categories-api";
import { orderDesignApi } from "./features/orderDesigns/orderDesignApi";

export const store = configureStore({
  reducer: {
    [clientsApi.reducerPath]: clientsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [designApi.reducerPath]: designApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [printingApi.reducerPath]: printingApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [orderDesignApi.reducerPath]: orderDesignApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you have non-serializable data
    })
      .concat(clientsApi.middleware)
      .concat(eventsApi.middleware)
      .concat(designApi.middleware)
      .concat(projectsApi.middleware)
      .concat(blogsApi.middleware)
      .concat(printingApi.middleware)
      .concat(categoryApi.middleware)
      .concat(orderDesignApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
