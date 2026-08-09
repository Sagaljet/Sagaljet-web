// lib/events-service.ts
import { eventsApi } from "../lib/features/events/eventsApi";
import { store } from "./store";

// Server-side function to get all events
export async function fetchAllEvents() {
  const result = await store.dispatch(
    eventsApi.endpoints.getAllEvents.initiate(undefined)
  );

  if (result.data) {
    return result.data;
  }

  throw new Error("Failed to fetch events");
}

// Server-side function to get event by slug
export async function fetchEventBySlug(slug: string) {
  const result = await store.dispatch(
    eventsApi.endpoints.getEventBySlug.initiate(slug)
  );

  if (result.data) {
    return result.data;
  }

  return null;
}

// Server-side function to get event by ID
export async function fetchEventById(id: number) {
  const result = await store.dispatch(
    eventsApi.endpoints.getEventById.initiate(id)
  );

  if (result.data) {
    return result.data;
  }

  return null;
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
