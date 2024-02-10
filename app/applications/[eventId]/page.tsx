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
  const token = session?.user.token;
  const [error, setError] = useState("");
  // const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Check both token and eventId are defined and session status is not loading
      if (status !== "loading" && !session) {
        // If the session has loaded but no session is found, prompt the user to log in
        setError("Authentication required.");
        // Optionally redirect to sign-in page or display a login prompt
        // signIn(); // Uncomment to redirect to sign-in
      } else if (token && eventId) {
        try {
          const fetchedData = await getApplicationsById(eventId, token);
          const flattenedData = await flattenApplicationsForTable(fetchedData);
          setApplications(flattenedData);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching events:", error.message);
            setError(error.message);
          } else {
            console.error("An unexpected error occurred");
            setError("An unexpected error occurred");
          }
        }
      }
    }
    fetchData();
  }, [eventId, token, status]);

  // if (authError) {
  //   throw new AuthRequiredError();
  // }

  if (error) {
    throw new Error(error);
  }

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  // console.log(applications);

  return (
    <div>
      <h1 className={title()}>
        {applications.length > 0
          ? `${applications[0].eventTitle} Applications`
          : "No Applications"}
      </h1>
      <UsersTableTemp applications={applications} />
    </div>
  );
}
