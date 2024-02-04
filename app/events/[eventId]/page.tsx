"use client";
import { title } from "@/components/primitives";
import { getEvent } from "@/lib/getEvent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ApplicationFormData, Event, Params } from "@/types";
import { Button } from "@nextui-org/react";
import { formatDate } from "@/utils/formatDate";
import ApplicationForm from "@/components/applicationForm";
import { AuthRequiredError } from "@/lib/exceptions";

export default function EventPage({ params: { eventId } }: Params) {
  const [event, setEvent] = useState<Event>();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData); // Ensure the fallback to an empty array
        setError("");
      } catch (error) {
        setError(`Error: ${error}`);
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, [eventId]);

  const handleApplyClick = async () => {
    if (!session) {
      throw new AuthRequiredError();
    }

    const applicationData = {
      eventId: eventId,
    };

    try {
      const response = await fetch("http://localhost:8500/application/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(`Error: ${errorResponse.error}`);
        return;
      }

      const result = await response.json();
      console.log("Application submitted successfully", result);
    } catch (error) {
      // Here, we handle network errors or other unexpected errors
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
        console.error("Failed to submit application:", error);
      } else {
        setError("Error: An unexpected error occurred");
        console.error("Failed to submit application:", error);
      }
      // Handle errors (e.g., show an error message)
    }
  };

  const handleFormSubmit = async (
    eventId: string,
    applicationData: ApplicationFormData
  ) => {
    try {
      const response = await fetch("http://localhost:8500/application/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...applicationData, eventId }),
      });

      if (!response.ok) {
        setError(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Application submitted successfully", result);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      setError(`Error: ${error}`);
      console.error("Failed to submit application:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  const isEventClosed = event?.status === "closed";
  const shouldShowApplication = !session && !isEventClosed;

  return (
    <div>
      <h1 className={title()}>{event?.title}</h1>
      <h1>{event?.description}</h1>
      <h1>{event?.location}</h1>
      <h1>{formatDate(event?.releaseDate)}</h1>
      <h1>{event?.status}</h1>
      {isEventClosed ? (
        <p className={title()}>This event is closed.</p>
      ) : shouldShowApplication ? (
        <ApplicationForm eventId={eventId} onSubmit={handleFormSubmit} />
      ) : session ? (
        <Button onClick={handleApplyClick}>Apply</Button>
      ) : null}
    </div>
  );
}
