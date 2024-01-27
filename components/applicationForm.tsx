import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import { ApplicationFormData } from "@/types";

type Props = {
  eventId: string;
  onSubmit: (eventId: string, data: ApplicationFormData) => void;
};

const ApplicationForm: React.FC<Props> = ({ eventId, onSubmit }) => {
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(eventId, formData);
  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col sm:flex-row justify-between items-center">
        <Input
          isRequired
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
          isRequired
          type="text"
          label="Last Name"
          labelPlacement="outside"
          placeholder="Last Name"
          className="max-w-xs"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <Input
          isRequired
          type="text"
          label="Address"
          labelPlacement="outside"
          placeholder="Address"
          className="max-w-xs"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center">
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
          isRequired
          type="text"
          label="Phone Number"
          labelPlacement="outside"
          placeholder="Phone Number"
          className="max-w-xs"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <Input
          isRequired
          type="text"
          label="Spoken Language"
          labelPlacement="outside"
          placeholder="Spoken Language"
          className="max-w-xs"
          name="spokenLanguage"
          value={formData.spokenLanguage}
          onChange={handleChange}
        />
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center">
        <Input
          isRequired
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
      </div>
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
      <div className="w-full flex flex-col sm:flex-row justify-center items-center mt-10">
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
