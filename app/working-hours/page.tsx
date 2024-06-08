"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { EventEntry } from "@/types";
import { title } from "@/components/primitives";
import { getAllUsersWorkingEntries } from "@/lib/getAllUsersWorkingEntries";
import WorkingHoursTable from "@/components/workingHoursTable";
import { useLanguage } from "@/utils/languageContext";
import { AuthRequiredError } from "@/lib/exceptions";

export default function WorkingHoursPage() {
  const [allEventEntries, setAllEventEntries] = useState<EventEntry[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");
  const { translations } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token) {
        try {
          const fetchedData = await getAllUsersWorkingEntries(token);
          setAllEventEntries(fetchedData.data);
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

  const handleDeleteEntry = async (
    currentEventId: string,
    onClose: () => void
  ) => {
    if (!session) {
      throw new AuthRequiredError();
    }
    try {
      const response = await fetch(
        `https://ocn-data.onrender.com/working-hours/working-entry/delete/${currentEventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      const updatedEntries = allEventEntries.filter(
        (eventEntry) => eventEntry._id !== currentEventId
      );
      setAllEventEntries(updatedEntries);
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <h1 className={title()}>{translations.strings.workingHours}</h1>
      <div className="mt-2">
     <WorkingHoursTable
        apps={allEventEntries}
        eventId={""}
        handleDeleteEntry={handleDeleteEntry}
      />
      </div>
    </div>
  );
}
