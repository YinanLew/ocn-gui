"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { EventEntry, Params } from "@/types";
import { getWorkingEntryById } from "@/lib/getWorkingEntryById";
import { AuthRequiredError } from "@/lib/exceptions";
import { updateWorkingEntryById } from "@/lib/updateWorkingEntryById";
import { useLanguage } from "@/utils/languageContext";

export default function EditWorkingEntryPage({ params: { eventId } }: Params) {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const [error, setError] = useState("");
  const { translations } = useLanguage();

  const [formData, setFormData] = useState<EventEntry>({
    _id: "",
    userName: "",
    eventTitle: "",
    startTime: "",
    endTime: "",
    hours: "",
    status: "",
  });

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && token && eventId) {
        try {
          const workingEntryData = await getWorkingEntryById(eventId, token);
          setFormData({
            ...workingEntryData,
          });
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
        setError("Authentication required.");
      }
    }
    fetchData();
  }, [eventId, token, status]);

  // Handle changes to input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes to the Select component for status
  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  // Submit updated application data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      throw new AuthRequiredError();
    }
    try {
      updateWorkingEntryById(eventId, formData, token);
      router.push(`/working-hours`); // Adjust the redirect path as needed
    } catch (error) {
      setError(`Error updating application: ${error}`);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Adjust as needed
  }

  // if (authError) {
  //   throw new AuthRequiredError();
  // }

  if (error) {
    throw new Error(error);
  }

  return (
    <>
      <h1 className={title()}>
        {translations.strings.edit}
        {translations.strings.workingHours}
      </h1>

      <form
        className="mt-10 sm:mt-28 w-full flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col sm:flex-row justify-around items-center">
          <div className="max-w-xs text-center">
            <h2>
              {translations.strings.firstName} {translations.strings.lastName}:{" "}
              {formData.userName}
            </h2>
          </div>

          <div className="max-w-xs text-center">
            <h2>
              {translations.strings.event}: {formData.eventTitle}
            </h2>
          </div>

          <div className="max-w-xs text-center">
            <h2>
              {translations.strings.workingHours}: {formData.hours}
            </h2>
          </div>
        </div>
        <br />
        <br />
        <div className="w-full flex flex-col sm:flex-row justify-between items-center">
          <Select
            label={translations.strings.status}
            labelPlacement="outside"
            className="max-w-xs"
            placeholder={formData.status}
            value={formData.status}
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <SelectItem key="pending" value="pending">
              {translations.strings.pending}
            </SelectItem>
            <SelectItem key="verified" value="verified">
              {translations.strings.verified}
            </SelectItem>
            <SelectItem key="rejected" value="rejected">
              {translations.strings.rejected}
            </SelectItem>
          </Select>
          <Input
            type="datetime-local"
            label={translations.strings.startDate}
            labelPlacement="outside"
            placeholder={translations.strings.startDate}
            className="max-w-xs"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />

          <Input
            type="datetime-local"
            label={translations.strings.deadline}
            labelPlacement="outside"
            placeholder={translations.strings.deadline}
            className="max-w-xs"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
        <Button className="mt-10" type="submit">
          {translations.strings.edit} {translations.strings.application}
        </Button>
      </form>
    </>
  );
}
