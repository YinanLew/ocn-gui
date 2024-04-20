"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthRequiredError } from "@/lib/exceptions";
import { getApplicationsById } from "@/lib/getApplicationsById";
import UsersTableTemp from "@/components/usersTable";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";
import { updateCertificateStatus } from "@/lib/updateCertificateStatus";
import { useLanguage } from "@/utils/languageContext";

export default function EventPage({ params: { eventId } }: Params) {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");
  const { translations } = useLanguage();
  // const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token && eventId) {
        try {
          const fetchedData = await getApplicationsById(eventId, token);
          const flattenedData = await flattenApplicationsForTable(fetchedData);
          setApplications(flattenedData);
        } catch (error: any) {
          if (error.message === "Token expired") {
            signOut({ redirect: false });
            setError("Your session has expired. Please log in again.");
          } else if (error.message === "Not Admin") {
            setError("Access denied: Not an admin.");
          } else {
            console.error("Error fetching events:", error.message);
            setError("Failed to fetch events");
          }
        }
      } else if (status === "unauthenticated") {
        setError("Authentication required.");
      }
    }
    fetchData();
  }, [eventId, token, status]);

  const handleRemoveApplication = (eventObjectId: string) => {
    setApplications(
      applications.filter((app) => app.eventUniqueId !== eventObjectId)
    );
  };

  const handleCertificateStatusChange = (
    eventId: string,
    userId: string,
    newStatus: string,
    token: string | undefined
  ) => {
    if (token) {
    }
  };

  const issueCertificate = (
    eventId: string,
    userId: string,
    token: string | undefined
  ) => {
    handleCertificateStatusChange(eventId, userId, "approved", token);
  };

  const rejectCertificate = (
    eventId: string,
    userId: string,
    token: string | undefined
  ) => {
    handleCertificateStatusChange(eventId, userId, "rejected", token);
  };

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <h1 className={title()}>
        {applications.length > 0
          ? `${applications[0].eventTitle} ${translations.strings.application}`
          : "No Applications"}
      </h1>
      <UsersTableTemp
        applications={applications}
        onRemoveApplication={handleRemoveApplication}
        onIssueCertificate={issueCertificate}
        onRejectCertificate={rejectCertificate}
      />
    </div>
  );
}
