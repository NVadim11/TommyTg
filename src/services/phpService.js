// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define a service using a base URL and expected endpoints
export const phpApi = createApi({
  reducerPath: "phpApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://aws.tomocat.com/api" }),
  tagTypes: ["Php"],
  endpoints: (builder) => ({
    getUserByTgId: builder.query({
      query: (id) => ({
        url: `/telegram-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Php"],
    }),
    // getUserByTgIdInit: builder.mutation({
    //   query: (id) => ({
    //     url: `/telegram-id/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Php"],
    // }),
    // checkCode: builder.mutation({
    //   query: (code) => ({
    //     url: `/check-referral-code/${code}`,
    //     method: "GET",
    //   }),
    //   invalidatesTags: "php",
    // }),
    // generateCode: builder.mutation({
    //   query: (wallet) => ({
    //     url: `/generate-referral-code/${wallet}`,
    //     method: "GET",
    //   }),
    // }),
    getLeaderboard: builder.mutation({
      query: (id) => `/liderbord/${id}`,
      method: "GET",
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
    passTask: builder.mutation({
      query: (body) => ({
        url: "/pass-task",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Php"],
    }),
    updateBalance: builder.mutation({
      query: (body) => ({
        url: "/update-balance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Php"],
    }),
    // increaseBalance: builder.mutation({
    //   query: (body) => ({
    //     url: "/increase-balance",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Php"],
    // }),
    setWallet: builder.mutation({
      query: (body) => ({
        url: "/set-wallet-address",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Php"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserByTgIdQuery,
  // useGetUserByTgIdInitMutation,
  // useCheckCodeMutation,
  useCreateUserMutation,
  // useGenerateCodeMutation,
  useGetLeaderboardMutation,
  usePassTaskMutation,
  useUpdateBalanceMutation,
  useSetWalletMutation,
  // useIncreaseBalanceMutation,
} = phpApi;