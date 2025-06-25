
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const editorApi = createApi({
  reducerPath: "editorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
    credentials: "include", 
  }),
  tagTypes: ["Summaries"],
  endpoints: (builder) => ({
    fetchAllSummaries: builder.query({
      query: () => "/summary/",
      providesTags: ["Summaries"],
    }),
    updateSummary: builder.mutation({
      query: ({ id, summaryText }) => ({
        url: `/summary/${id}`,
        method: "PUT",
        body: { summaryText },
      }),
      invalidatesTags: ["Summaries"],
    }),
    deleteSummary: builder.mutation({
      query: (id) => ({
        url: `/summary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Summaries"],
    }),
  }),
});

export const {
  useFetchAllSummariesQuery,
  useUpdateSummaryMutation,
  useDeleteSummaryMutation,
} = editorApi;
