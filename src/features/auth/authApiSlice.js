import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";
import { setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      login: builder.mutation({
         query: (credentials) => ({
            url: "/auth",
            method: "POST",
            body: { ...credentials },
         }),
      }),
      sendLogout: builder.mutation({
         query: () => ({
            url: "/auth/logout",
            method: "GET",
         }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
               await queryFulfilled;
               dispatch(logOut());
               dispatch(apiSlice.util.resetApiState());
            } catch (err) {
               console.log(err);
            }
         },
      }),
      refresh: builder.mutation({
         query: () => ({
            url: "/auth/refresh",
            method: "GET",
         }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               console.log(data);
               const { accessToken } = data;
               dispatch(setCredentials({ accessToken }));
            } catch (err) {
               console.log(err);
            }
         },
      }),
   }),
});

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
   authApiSlice;
