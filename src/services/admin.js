import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const adminApi = createApi({
	reducerPath: "adminApi",
	baseQuery: fetchBaseQuery({ baseUrl: "https://admin.prodtest1.space/api/game-data" }),
	endpoints: (builder) => ({
		getGameInfo: builder.query({
			query: () => `/`,
		}),
	}),
});

export const { useGetGameInfoQuery } = adminApi;