import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      // Retrieve the token whenever an API request is made
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth', 'User','Availability','Doctors','Appointments'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Example of a protected endpoint that will automatically send the token header
    getUserProfile: builder.query({
      query: (userId) => `/users/${userId}`,
    }),
  }),
});

export const { useLoginUserMutation, useGetUserProfileQuery } = apiSlice;