"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { title } from "@/components/primitives";
import UsersTableTemp from "@/components/usersTable";
import { getAllApplications } from "@/lib/getAllApplications";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";
import { AuthRequiredError } from "@/lib/exceptions";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token) {
        try {
          const fetchedData = await getAllApplications(token);
          const flattenedData = flattenApplicationsForTable(fetchedData);
          setApplications(flattenedData);
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
        // If the session status is unauthenticated, set an error prompting to authenticate.
        setError("Access denied: Not an admin.");
      }
    }
    fetchData();
  }, [token, status]);

  const handleRemoveApplication = (eventObjectId: string) => {
    setApplications(
      applications.filter((app) => app.eventUniqueId !== eventObjectId)
    );
  };

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <h1 className={title()}>All Applications</h1>
      <UsersTableTemp
        applications={applications}
        onRemoveApplication={handleRemoveApplication}
      />
    </div>
  );
}
