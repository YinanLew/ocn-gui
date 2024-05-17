"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { title } from "@/components/primitives";
import UsersTableTemp from "@/components/usersTable";
import { getAllApplications } from "@/lib/getAllApplications";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";
import { updateCertificateStatus } from "@/lib/updateCertificateStatus";
import { useLanguage } from "@/utils/languageContext";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [error, setError] = useState("");
  const { translations } = useLanguage();

  useEffect(() => {
    fetchData();
  }, [token, status]);

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
      setError("Access denied: Not an admin.");
    }
  }

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
      updateCertificateStatus(eventId, userId, newStatus, token)
        .then((result) => {
          if (result && result.success) {
            fetchData();
          }
        })
        .catch((error) => {
          console.error(
            `Failed to ${
              newStatus === "approved" ? "issue" : "reject"
            } certificate:`,
            error
          );
        });
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

  console.log(applications);

  return (
    <div>
      <h1 className={title()}>{translations.strings.allApps}</h1>
      <UsersTableTemp
        applications={applications}
        onRemoveApplication={handleRemoveApplication}
        onIssueCertificate={issueCertificate}
        onRejectCertificate={rejectCertificate}
      />
    </div>
  );
}
