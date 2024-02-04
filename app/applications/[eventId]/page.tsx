"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthRequiredError } from "@/lib/exceptions";
import { getApplicationsById } from "@/lib/getApplicationsById";
import UsersTableTemp from "@/components/usersTable";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";

export default function EventPage({ params: { eventId } }: Params) {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getApplicationsById(eventId);
        const flattenedData = await flattenApplicationsForTable(fetchedData);
        setApplications(flattenedData);
      } catch (error) {
        if (error instanceof Error) {
          // Safe to access error.message here
          console.error("Error fetching events:", error.message);
          setError(error.message);
        } else {
          // Handle non-Error objects or generic errors
          console.error("An unexpected error occurred");
          setError("An unexpected error occurred");
        }
      }
    }
    fetchData();
  }, [eventId]);

  if (error) {
    throw new Error(error);
  }

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  // console.log(applications);

  return (
    <div>
      <h1 className={title()}>{applications.length > 0 ? applications[0].eventTitle + " Applications" : "Loading Applications..."}</h1>
      <UsersTableTemp applications={applications} />
    </div>
  );
}
