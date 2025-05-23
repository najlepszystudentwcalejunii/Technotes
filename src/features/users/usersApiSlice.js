import { createSelector, createEntityAdapter } from "@reduxjs/toolkit/react";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getUsers: builder.query({
         query: () => ({
            url: "/users",
            validateStatus: (response, result) => {
               return response.status === 200 && !result.isError;
            },
         }),

         transformResponse: (responseData) => {
            const loadedUsers = responseData.map((user) => {
               user.id = user._id;
               return user;
            });
            return usersAdapter.setAll(initialState, loadedUsers);
         },
         providesTags: (result, error, arg) => {
            if (result?.ids) {
               return [
                  { type: "User", id: "LIST" },
                  ...result.ids.map((id) => ({ type: "User", id })),
               ];
            } else return [{ type: "User", id: "LIST" }];
         },
      }),
      addNewUser: builder.mutation({
         query: (userData) => ({
            url: "/users",
            method: "POST",
            body: { ...userData },
         }),
         invalidatesTags: [{ type: "User", id: "LIST" }],
      }),
      updateUser: builder.mutation({
         query: (userData) => ({
            url: "/users",
            method: "PATCH",
            body: { ...userData },
         }),
         invalidatesTags: (res, err, arg) => [{ type: "User", id: arg.id }],
      }),
      deleteUser: builder.mutation({
         query: ({ id }) => ({
            url: "/users",
            method: "DELETE",
            body: { id },
         }),
         invalidatesTags: (res, err, arg) => [{ type: "User", id: arg.id }],
      }),
   }),
});

export const {
   useGetUsersQuery,
   useAddNewUserMutation,
   useDeleteUserMutation,
   useUpdateUserMutation,
} = usersApiSlice;

export const selectUserResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
   selectUserResult,
   (usersResult) => usersResult.data
);

export const {
   selectAll: selectAllUsers,
   selectById: selectUserById,
   selectIds: selectUserIds,
} = usersAdapter.getSelectors(
   (state) => selectUsersData(state) ?? initialState
);
