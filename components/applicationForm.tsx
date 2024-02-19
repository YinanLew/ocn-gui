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

  const [formErrors, setFormErrors] = useState({
    email: "",
    phoneNumber: "",
    referralContactPhoneNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    spokenLanguage: "",
    writtenLanguage: "",
    volunteerExperience: "",
  });

  const validateInput = (name: string, value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const phoneNumberRegex = /^\d{10,}$/;
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "spokenLanguage",
      "writtenLanguage",
      "volunteerExperience",
    ];
    if (requiredFields.includes(name) && !value.trim()) {
      return "This field cannot be empty";
    }
    switch (name) {
      case "email":
        return emailRegex.test(value) ? "" : "Please enter a valid email";
      case "phoneNumber":
        return phoneNumberRegex.test(value)
          ? ""
          : "Please enter a minimum 10 numbers phone number";
      case "referralContactPhoneNumber":
        return phoneNumberRegex.test(value)
          ? ""
          : "Please enter a minimum 10 numbers phone number";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue = name === "email" ? value.toLowerCase() : value;
    const errorMessage = validateInput(name, updatedValue);

    setFormData({ ...formData, [name]: updatedValue });
    setFormErrors({ ...formErrors, [name]: errorMessage });
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
          isInvalid={!!formErrors.firstName}
          errorMessage={formErrors.firstName}
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
          isInvalid={!!formErrors.lastName}
          errorMessage={formErrors.lastName}
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
          isInvalid={!!formErrors.address}
          errorMessage={formErrors.address}
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
          isInvalid={!!formErrors.email}
          errorMessage={formErrors.email}
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
          isInvalid={!!formErrors.phoneNumber}
          errorMessage={formErrors.phoneNumber}
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
          isInvalid={!!formErrors.spokenLanguage}
          errorMessage={formErrors.spokenLanguage}
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
          isInvalid={!!formErrors.writtenLanguage}
          errorMessage={formErrors.writtenLanguage}
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
          isInvalid={!!formErrors.referralContactPhoneNumber}
          errorMessage={formErrors.referralContactPhoneNumber}
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
        isInvalid={!!formErrors.volunteerExperience}
        errorMessage={formErrors.volunteerExperience}
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
