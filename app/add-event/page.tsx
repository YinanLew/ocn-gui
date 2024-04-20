"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createEvent } from "@/lib/createEvent";
import { title } from "@/components/primitives";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { EventFormData } from "@/types";
import { AuthRequiredError } from "@/lib/exceptions";
import { useLanguage } from "@/utils/languageContext";

export default function AddEventPage() {
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const { translations } = useLanguage();

  const [error, setError] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    location: "",
    releaseDate: currentDate,
    startDate: "",
    deadline: "",
    description: "",
    imageUrl: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      throw new AuthRequiredError();
    }

    try {
      await createEvent(formData, token);
      router.push("/events"); // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error creating event:", error);
      setError(`Error creating event: "${error}`);
      // Handle error (e.g., show an error message)
    }
  };

  if (error) {
    throw new AuthRequiredError();
  }

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  return (
    <div>
      <h1 className={title()}>
        {translations.strings.addNew} {translations.strings.event}
      </h1>
      <div className="mt-10 sm:mt-32">
        <form
          className="w-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <Input
              isRequired
              type="text"
              label={translations.strings.event}
              labelPlacement="outside"
              placeholder={translations.strings.event}
              className="max-w-xs"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="text"
              label={translations.strings.location}
              labelPlacement="outside"
              placeholder={translations.strings.location}
              className="max-w-xs"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="date"
              label={translations.strings.releaseDate}
              labelPlacement="outside"
              placeholder={translations.strings.releaseDate}
              className="max-w-xs"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <Input
              isRequired
              type="date"
              label={translations.strings.startDate}
              labelPlacement="outside"
              placeholder={translations.strings.startDate}
              className="max-w-xs"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="date"
              label={translations.strings.deadline}
              labelPlacement="outside"
              placeholder={translations.strings.deadline}
              className="max-w-xs"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
            <div className="max-w-xs flex flex-row justify-between items-center">
              <Input
                isRequired
                type="text"
                label={translations.strings.image}
                labelPlacement="outside"
                placeholder={translations.strings.image}
                className="w-52 mr-2"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <Select
                className="w-32"
                label={translations.strings.status}
                labelPlacement="outside"
                placeholder={translations.strings.status}
                value={formData.status}
                onChange={(e) => handleSelectChange(e.target.value)}
              >
                <SelectItem key="active" value="active">
                  {translations.strings.active}
                </SelectItem>
                <SelectItem key="paused" value="paused">
                  {translations.strings.paused}
                </SelectItem>
                <SelectItem key="closed" value="closed">
                  {translations.strings.closedStatus}
                </SelectItem>
              </Select>
            </div>
          </div>
          <Textarea
            isRequired
            label={translations.strings.description}
            labelPlacement="outside"
            placeholder={`${translations.strings.description}...`}
            className="w-full"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Button className="mt-10" type="submit">
            {translations.strings.create}
          </Button>
        </form>
      </div>
    </div>
  );
}
