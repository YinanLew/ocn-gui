"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import UsersTableTemp from "@/components/usersTable";
import { getAllApplications } from "@/lib/getAllApplications";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";
import { AuthRequiredError } from "@/lib/exceptions";

export default function ApplicationsPage({ params: { eventId } }: Params) {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (status !== "loading" && !session) {
        setError("Authentication required.");
        // Optionally, signIn() or show a message prompting the user to log in
      } else if (token) {
        try {
          const fetchedData = await getAllApplications(token);
          const flattenedData = flattenApplicationsForTable(fetchedData);
          setApplications(flattenedData);
        } catch (error) {
          console.error("Error fetching applications:", error);
          setError("Failed to fetch applications");
        }
      }
    }
    fetchData();
  }, [token, status]);

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new AuthRequiredError();
  }

  return (
    <div>
      <h1 className={title()}>
        <UsersTableTemp applications={applications} />
      </h1>
    </div>
  );
}
