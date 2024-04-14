"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { EventEntry, Params } from "@/types";
import WorkingHoursTable from "@/components/workingHoursTable";
import { useRouter } from "next/navigation";
import { getAllWorkingEntriesById } from "@/lib/getAllWorkingEntriesById";

export default function WorkingHoursSubmitPage({
  params: { eventId },
}: Params) {
  const [eventEntries, setEventEntries] = useState<EventEntry[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token && eventId) {
        try {
          const fetchedData = await getAllWorkingEntriesById(token, eventId);
          setEventEntries(fetchedData.apps);
        } catch (error: any) {
          console.error("Error fetching applications:", error.message);
          if (error.message === "Token expired") {
            signOut({ redirect: false });
            setError("Your session has expired. Please log in again.");
          } else if (error.message === "Not Admin") {
            setError("Access denied: Not an admin.");
          } else {
            setError("Failed to fetch applications");
          }
        }
      } else if (status === "unauthenticated") {
        setError("Authentication required.");
      }
    }
    fetchData();
  }, [token, status]);

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <WorkingHoursTable apps={eventEntries} eventId={eventId} />
    </div>
  );
}
