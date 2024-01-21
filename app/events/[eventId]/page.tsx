"use client";
import { title } from "@/components/primitives";
import { getEvent } from "@/lib/getEvent";
import { useEffect, useState } from "react";
import { Event, Params } from "@/types";

export default function EventPage({ params: { eventId } }: Params) {
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    async function fetchData() {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData); // Ensure the fallback to an empty array
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 className={title()}>View Event {event?._id}</h1>
      <h1>{event?.title}</h1>
      <h1>{event?.description}</h1>
      <h1>{event?.location}</h1>
      <h1>{event?.date}</h1>
      <h1>{event?.status}</h1>
    </div>
  );
}
