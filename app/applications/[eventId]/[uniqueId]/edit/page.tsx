"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { ApplicationFormData, Params } from "@/types";
import { getApplicationByUniqueId } from "@/lib/getApplicationByUniqueId";
import { updateApplicationByUniqueId } from "@/lib/updateApplicationByUniqueId";
import { AuthRequiredError } from "@/lib/exceptions";
import { useLanguage } from "@/utils/languageContext";

export default function EditApplicationPage({
  params: { eventId, uniqueId },
}: Params) {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const [error, setError] = useState("");
  const { translations } = useLanguage();

  // const [authError, setAuthError] = useState("");

  // Initialize form data with application-specific fields
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    spokenLanguage: "",
    writtenLanguage: "",
    volunteerExperience: "",
    referralSource: "",
    referralContactPhoneNumber: "",
    skillsAndExpertise: "",
    motivationToVolunteer: "",
    status: "",
    title: "",
  });

  useEffect(() => {
    async function fetchData() {
      // Wait for session to be fully loaded or determined to be absent
      if (status === "authenticated" && token && uniqueId) {
        try {
          const applicationData = await getApplicationByUniqueId(
            uniqueId,
            token
          );
          setFormData({
            ...applicationData,
            // Additional processing if needed
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
  }, [uniqueId, token, status]);

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
      // Assuming updateApplication is a function you've defined to update application data
      await updateApplicationByUniqueId(uniqueId, formData, token);
      router.push(`/applications/${eventId}`); // Adjust the redirect path as needed
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
      <h1 className={title()}>Edit Application</h1>

      <form
        className="mt-10 sm:mt-28 w-full flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col sm:flex-row justify-between items-center">
          <Input
            type="text"
            label={translations.strings.firstName}
            labelPlacement="outside"
            placeholder={translations.strings.firstName}
            className="max-w-xs"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <div className="flex flex-row justify-between items-center">
            <Input
              type="text"
              label={translations.strings.lastName}
              labelPlacement="outside"
              placeholder={translations.strings.lastName}
              className="max-w-xs mr-16"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <Select
              label={translations.strings.status}
              labelPlacement="outside"
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
                {translations.strings.appRejected}
              </SelectItem>
            </Select>
          </div>

          <Input
            type="text"
            label={translations.strings.location}
            labelPlacement="outside"
            placeholder={translations.strings.location}
            className="max-w-xs"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-between items-center">
          <Input
            type="text"
            label={translations.strings.phoneNumber}
            labelPlacement="outside"
            placeholder={translations.strings.phoneNumber}
            className="max-w-xs"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <Input
            isRequired
            type="email"
            label={translations.strings.email}
            labelPlacement="outside"
            placeholder={translations.strings.email}
            className="max-w-xs"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            type="text"
            label={translations.strings.spokenLanguage}
            labelPlacement="outside"
            placeholder={translations.strings.spokenLanguage}
            className="max-w-xs"
            name="spokenLanguage"
            value={formData.spokenLanguage}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-between items-center">
          <Input
            type="text"
            label={translations.strings.writtenLanguage}
            labelPlacement="outside"
            placeholder={translations.strings.writtenLanguage}
            className="max-w-xs"
            name="writtenLanguage"
            value={formData.writtenLanguage}
            onChange={handleChange}
          />

          <Input
            type="text"
            label={translations.strings.referral}
            labelPlacement="outside"
            placeholder={translations.strings.referral}
            className="max-w-xs"
            name="referralSource"
            value={formData.referralSource}
            onChange={handleChange}
          />

          <Input
            type="text"
            label={`${translations.strings.referral} ${translations.strings.phoneNumber}`}
            labelPlacement="outside"
            placeholder={`${translations.strings.referral} ${translations.strings.phoneNumber}`}
            className="max-w-xs"
            name="referralContactPhoneNumber"
            value={formData.referralContactPhoneNumber}
            onChange={handleChange}
          />
        </div>
        <Textarea
          isRequired
          label={translations.strings.experiences}
          labelPlacement="outside"
          placeholder={translations.strings.experiences}
          className="w-full"
          name="volunteerExperience"
          value={formData.volunteerExperience}
          onChange={handleChange}
        />

        <Textarea
          label={translations.strings.skills}
          labelPlacement="outside"
          placeholder={translations.strings.skills}
          className="w-full"
          name="skillsAndExpertise"
          value={formData.skillsAndExpertise}
          onChange={handleChange}
        />

        <Textarea
          label={translations.strings.motivations}
          labelPlacement="outside"
          placeholder={translations.strings.motivations}
          className="w-full"
          name="motivationToVolunteer"
          value={formData.motivationToVolunteer}
          onChange={handleChange}
        />

        <Button className="mt-10" type="submit">
          {translations.strings.edit} {translations.strings.apply}
        </Button>
      </form>
    </>
  );
}
