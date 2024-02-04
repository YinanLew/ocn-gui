"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import UsersTableTemp from "@/components/usersTable";
import { getAllApplications } from "@/lib/getAllApplications";
import { FlattenedApplication, Params } from "@/types";
import { flattenApplicationsForTable } from "@/utils/flattenApplicationsForTable";

export default function ApplicationsPage({ params: { eventId } }: Params) {
  const [applications, setApplications] = useState<FlattenedApplication[]>([]);
  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getAllApplications();
        const flattenedData = flattenApplicationsForTable(fetchedData);
        setApplications(flattenedData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, [eventId]);


  return (
    <div>
      <h1 className={title()}>
        <UsersTableTemp applications={applications} />
      </h1>
    </div>
  );
}
