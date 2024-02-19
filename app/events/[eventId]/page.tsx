"use client";
import { title } from "@/components/primitives";
import { getEvent } from "@/lib/getEvent";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ApplicationFormData, Event, Params } from "@/types";
import { Button } from "@nextui-org/react";
import { formatDate } from "@/utils/formatDate";
import ApplicationForm from "@/components/applicationForm";
import { useRouter } from "next/navigation";
import { AuthRequiredError } from "@/lib/exceptions";
import { submitApplication } from "@/lib/submitApplication";

export default function EventPage({ params: { eventId } }: Params) {
  const [event, setEvent] = useState<Event>();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>();
  const router = useRouter();

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
      await submitApplication(applicationData, session.user.token);
      router.push("/events");
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof Error && error.message === "Token expired") {
        // Handle token expiration
        signOut({ redirect: false });
        setError("Your session has expired. Please log in again.");
      } else {
        // Handle other errors
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    }
  };

  const handleFormSubmit = async (
    eventId: string,
    applicationData: ApplicationFormData
  ) => {
    try {
      await submitApplication({ ...applicationData, eventId });
      router.push("/events");
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError("An unexpected error occurred during application submission.");
      }
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
