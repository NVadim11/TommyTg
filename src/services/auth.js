// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.prodtest1.space" }),
  tagTypes: ["Twitter"],
  endpoints: (builder) => ({
    twitterAuth: builder.mutation({
      query: () => ({
        url: `/twitter/request-token`,
        method: "GET",
      }),
    }),
    twitterCallback: builder.mutation({
      query: (body) => ({
        url: `/twitter-task`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Twitter"]
    }),
    discordCallback: builder.mutation({
      query: (body) => ({
        url: "/auth/discord/callback",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useTwitterAuthMutation,
  useTwitterCallbackMutation,
  useDiscordCallbackMutation,
} = authApi;
