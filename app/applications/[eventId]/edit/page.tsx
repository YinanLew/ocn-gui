"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { ApplicationFormData, Params } from "@/types";
import { getApplicationByUniqueId } from "@/lib/getApplicationByUniqueId";
import { updateApplicationByUniqueId } from "@/lib/updateApplicationByUniqueId";

export default function EditApplicationPage({ params: { eventId } }: Params) {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const [error, setError] = useState("");

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

  console.log(formData);

  useEffect(() => {
    async function fetchData() {
      try {
        // Assuming getApplication is a function you've defined to fetch application data
        const applicationData = await getApplicationByUniqueId(eventId);
        console.log(applicationData);

        setFormData({
          ...applicationData,
          // Format any date fields if necessary
        });
      } catch (error) {
        setError(`"Error updating event: "${error}`);
        console.error("Error fetching application:", error);
      }
    }
    fetchData();
  }, [eventId]);

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
      return; // Handle unauthenticated state
    }
    try {
      // Assuming updateApplication is a function you've defined to update application data
      await updateApplicationByUniqueId(eventId, formData, token);
      router.push("/applications"); // Adjust the redirect path as needed
    } catch (error) {
      setError(`Error updating application: ${error}`);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Adjust as needed
  }

  if (error) {
    throw new Error(error);
  }

  console.log(eventId);

  return (
    <>
      <h1 className={title()}>Edit Application</h1>

      <form
        className="mt-10 sm:mt-28 w-full flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col sm:flex-row justify-between items-center">
          <Select
            className="w-32"
            label="Status"
            labelPlacement="outside"
            placeholder={formData.status}
            value={formData.status}
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <SelectItem key="pending" value="pending">
              Pending
            </SelectItem>
            <SelectItem key="verified" value="verified">
              Verified
            </SelectItem>
            <SelectItem key="rejected" value="rejected">
              Rejected
            </SelectItem>
          </Select>

          <Input
            type="text"
            label="First Name"
            labelPlacement="outside"
            placeholder="First Name"
            className="max-w-xs"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            type="text"
            label="Last Name"
            labelPlacement="outside"
            placeholder="Last Name"
            className="max-w-xs"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <Input
          type="text"
          label="Address"
          labelPlacement="outside"
          placeholder="Address"
          className="max-w-xs"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Phone"
          labelPlacement="outside"
          placeholder="Phone"
          className="max-w-xs"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <Input
          isRequired
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          className="max-w-xs"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Spoken Language"
          labelPlacement="outside"
          placeholder="Spoken Language"
          className="max-w-xs"
          name="spokenLanguage"
          value={formData.spokenLanguage}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Written Language"
          labelPlacement="outside"
          placeholder="Written Language"
          className="max-w-xs"
          name="writtenLanguage"
          value={formData.writtenLanguage}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Referral Source"
          labelPlacement="outside"
          placeholder="Referral Source"
          className="max-w-xs"
          name="referralSource"
          value={formData.referralSource}
          onChange={handleChange}
        />

        <Input
          type="text"
          label="Referral Contact Phone Number"
          labelPlacement="outside"
          placeholder="Referral Contact Phone Number"
          className="max-w-xs"
          name="referralContactPhoneNumber"
          value={formData.referralContactPhoneNumber}
          onChange={handleChange}
        />

        <Textarea
          isRequired
          label="Volunteer Experience"
          labelPlacement="outside"
          placeholder="Describe your volunteer experience"
          className="w-full"
          name="volunteerExperience"
          value={formData.volunteerExperience}
          onChange={handleChange}
        />

        <Textarea
          label="Skills and Expertise"
          labelPlacement="outside"
          placeholder="Describe your skills and expertise"
          className="w-full"
          name="skillsAndExpertise"
          value={formData.skillsAndExpertise}
          onChange={handleChange}
        />

        <Textarea
          label="Motivation to Volunteer"
          labelPlacement="outside"
          placeholder="What motivates you to volunteer?"
          className="w-full"
          name="motivationToVolunteer"
          value={formData.motivationToVolunteer}
          onChange={handleChange}
        />

        <Button type="submit">Update Application</Button>
      </form>
    </>
  );
}
