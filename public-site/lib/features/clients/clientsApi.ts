// redux/api/clientsApi.ts
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Client interface
export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  description?: string | null;
  createAt: string;
  updateAt: string;
}

// Response types
interface ClientsResponse {
  success: boolean;
  result: Client[];
}

export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Url,
  }),
  tagTypes: ["Clients"],
  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query<Client[], void>({
      query: () => "/client/all",
      transformResponse: (response: ClientsResponse) => response.result || [],
      providesTags: ["Clients"],
    }),
  }),
});

// Export hooks
export const { useGetClientsQuery } = clientsApi;

// Export endpoints
export const { getClients } = clientsApi.endpoints;
