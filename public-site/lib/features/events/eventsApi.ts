// redux/api/eventsApi.ts
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Event {
  id: number;
  title: string;
  client:string
  link:string
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string | null;
  imageUrl: string | null;
  isActive: boolean;
  slug?: string;
  category?: string;
  time?: string;
  capacity?: number;
  registrationRequired?: boolean;
  createAt: string;
  updateAt: string;
}

interface EventsResponse {
  result: Event[];
  success: boolean;
}

interface EventResponse {
  result: Event;
  success: boolean;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Url,
  }),
  tagTypes: ["Event", "Events"],
  endpoints: (builder) => ({
    // Get active events only
    getActiveEvents: builder.query<Event[], void>({
      query: () => "/event/get-events",
      transformResponse: (response: EventsResponse) => response.result,
      providesTags: ["Events"],
    }),

    // Get all events (including inactive)
    getAllEvents: builder.query<Event[], void>({
      query: () => "/event/get-all-events",
      transformResponse: (response: EventsResponse) => response.result,
      providesTags: ["Events"],
    }),

    // Get single event by ID
    getEventById: builder.query<Event, number>({
      query: (id) => `/event/get-event/${id}`,
      transformResponse: (response: EventResponse) => response.result,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    // Get single event by slug
    getEventBySlug: builder.query<Event, string>({
      query: (slug) => `/event/get-event-by-slug/${slug}`,
      transformResponse: (response: EventResponse) => response.result,
      providesTags: (result, error, slug) => [{ type: "Event", id: slug }],
    }),

    // Get upcoming events
    getUpcomingEvents: builder.query<Event[], void>({
      query: () => "/event/get-upcoming-events",
      transformResponse: (response: EventsResponse) => response.result,
      providesTags: ["Events"],
    }),

    // Get past events
    getPastEvents: builder.query<Event[], void>({
      query: () => "/event/get-past-events",
      transformResponse: (response: EventsResponse) => response.result,
      providesTags: ["Events"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetActiveEventsQuery,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useGetEventBySlugQuery,
  useGetUpcomingEventsQuery,
  useGetPastEventsQuery,
} = eventsApi;

// Export endpoints for server-side usage
export const {
  getActiveEvents,
  getAllEvents,
  getEventById,
  getEventBySlug,
  getUpcomingEvents,
  getPastEvents,
} = eventsApi.endpoints;
