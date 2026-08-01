import { apiSlice } from './apiSlice';

export const patientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<any, { page?: number; limit?: number; specialization?: string } | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const specialization = params?.specialization ? `&specialization=${params.specialization}` : '';
        return `patient/doctors?page=${page}&limit=${limit}${specialization}`;
      },
      providesTags: ['Doctors'],
    }),
    bookAppointment: builder.mutation<any, { slotId: number }>({
      query: (body) => ({
        url: 'patient/appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments', 'Doctors'],
    }),
    getAppointments: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        return `patient/appointments?page=${page}&limit=${limit}`;
      },
      providesTags: ['Appointments'],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetDoctorsQuery, 
  useBookAppointmentMutation, 
  useGetAppointmentsQuery 
} = patientApiSlice;