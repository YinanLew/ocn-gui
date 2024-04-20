"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Button } from "@nextui-org/react";
import { EventEntry, Params } from "@/types";
import { AuthRequiredError } from "@/lib/exceptions";
import { submitWorkingHours } from "@/lib/submitWorkingHours";
import { useLanguage } from "@/utils/languageContext";

export default function AddHoursPage({ params: { eventId } }: Params) {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const { translations } = useLanguage();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<EventEntry>>({
    startTime: "",
    endTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      throw new AuthRequiredError();
    }

    try {
      await submitWorkingHours(formData, token, eventId);
      router.push(`/my-applications/${eventId}`); // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof Error && error.message === "Token expired") {
        // Handle token expiration
        signOut({ redirect: false });
        setError("Your session has expired. Please log in again.");
      } else {
        // Handle other errors
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
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
      <h1 className={title()}>{translations.strings.addNew}</h1>
      <div className="mt-10 sm:mt-32">
        <form
          className="w-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col sm:flex-row justify-around items-center">
            <Input
              isRequired
              type="datetime-local"
              label="Start Time"
              labelPlacement="outside"
              placeholder="Start Time Date"
              className="max-w-xs"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />

            <Input
              isRequired
              type="datetime-local"
              label="End Time"
              labelPlacement="outside"
              placeholder="End Time"
              className="max-w-xs"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
          <Button className="mt-10" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
