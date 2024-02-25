"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { title } from "@/components/primitives";
import { getAllUsersWorkingEntries } from "@/lib/getAllUsersWorkingEntries";

export default function WorkingHoursPage() {
  const [allWorkingHours, setAllWorkingHours] = useState<[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token) {
        try {
          const fetchedData = await getAllUsersWorkingEntries(token);
          setAllWorkingHours(fetchedData);
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
        setError("Authentication required.");
      }
    }
    fetchData();
  }, [token, status]);

  console.log(allWorkingHours);

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <h1 className={title()}>Working Hours</h1>
    </div>
  );
}
