import { apiSlice } from './apiSlice';

export const doctorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAvailability: builder.mutation({
            query: (availabilityData) => ({
                url: 'doctor/availability',
                method: 'POST',
                body: availabilityData,
            }),
            invalidatesTags: ['Availability'],
        }),
        getAvailability: builder.query<any, { page?: number; limit?: number } | void>({
            query: (params) => {
                const page = params?.page ?? 1;
                const limit = params?.limit ?? 10;
                return `doctor/availability?page=${page}&limit=${limit}`;
            },
            providesTags: ['Availability'],
        }),
        getAppointments: builder.query<any, { page?: number; limit?: number } | void>({
            query: (params) => {
                const page = params?.page ?? 1;
                const limit = params?.limit ?? 10;
                return `doctor/appointments?page=${page}&limit=${limit}`;
            },
            providesTags: ['Appointments'],
        }),
        deleteAvailability: builder.mutation<any, string | number>({
            query: (id) => ({
                url: `doctor/availability/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Availability'],
        }),
    }),
    overrideExisting: true, // <-- Placed inside the options object here
});

export const { 
    useAddAvailabilityMutation, 
    useGetAvailabilityQuery, 
    useGetAppointmentsQuery, 
    useDeleteAvailabilityMutation 
} = doctorApiSlice;