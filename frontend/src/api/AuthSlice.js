import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    credentials: "include",
  }),
  tagTypes: ["User", "Summary"],
  endpoints: (builder) => ({
    // --- AUTH ---
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    fetchMe: builder.query({
      query: () => "/auth/user/user-details",
      providesTags: ["User","Summary"],
    }),
    

    // --- SUMMARY ---
    fetchSummaries: builder.query({
      query: () => "/api/summary/",
      providesTags: ["Summary"],
    }),
    getSummaryStatus: builder.query({
      query: (jobId) => `/api/summary/status/${jobId}`,
    }),
    queueSummary: builder.mutation({
      query: (formData) => ({
        url: "/api/summary/queue",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Summary"],
    }),
    updateSummary: builder.mutation({
      query: ({ id, summaryText }) => ({
        url: `/api/summary/${id}`,
        method: "PUT",
        body: { summaryText },
      }),
      invalidatesTags: ["Summary"],
    }),
    deleteSummary: builder.mutation({
      query: (id) => ({
        url: `/api/summary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Summary"],
    }),
    getAllUsers: builder.query({
      query: () => "/api/admin/users",
    }),
    rechargeCredits: builder.mutation({
      query: ({ userId, amount }) => ({
        url: "/api/admin/recharge",
        method: "POST",
        body: { userId, amount },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useFetchMeQuery,
  // useFetchMeQuery,
  useFetchSummariesQuery,
  useQueueSummaryMutation,
  useGetSummaryStatusQuery,
  useDeleteSummaryMutation,
  useUpdateSummaryMutation,
  useGetAllUsersQuery,
  useRechargeCreditsMutation,
} = authApi;
