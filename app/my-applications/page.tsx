"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { title } from "@/components/primitives";
import { AuthRequiredError } from "@/lib/exceptions";
import { getUserApplications } from "@/lib/getUserApplications";
import { EventWorkingHours } from "@/types";
import AppsTable from "@/components/myAppsTable";
import { useLanguage } from "@/utils/languageContext";

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");
  const [eventsWorkingHours, setEventsWorkingHours] = useState<
    EventWorkingHours[]
  >([]);
  const { translations } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token) {
        try {
          const fetchedData = await getUserApplications(token);
          setEventsWorkingHours(fetchedData.data);
        } catch (error: any) {
          console.error("Error fetching applications:", error.message);
          if (error.message === "Token expired") {
            signOut({ redirect: false });
            setError("Your session has expired. Please log in again.");
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

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new AuthRequiredError();
  }

  return (
    <div>
      <h1 className={title()}>{translations.strings.myApps}</h1>
      <AppsTable apps={eventsWorkingHours} />
    </div>
  );
}
