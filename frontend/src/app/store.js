import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/AuthSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { editorApi } from "../api/EditorApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [editorApi.reducerPath]: editorApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, editorApi.middleware),
});

setupListeners(store.dispatch);

export default store;
