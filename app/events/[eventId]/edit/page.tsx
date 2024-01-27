"use client";
import React, { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";
import { getEvent } from "@/lib/getEvent";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { EventFormData, Params } from "@/types";
import { updateEvent } from "@/lib/updateEvent";
import { formatDate } from "@/utils/formatDate";

export default function EditEventPage({ params: { eventId } }: Params) {
  const { data: session, status } = useSession();
  const token = session?.user.token;

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    location: "",
    releaseDate: "",
    startDate: "",
    deadline: "",
    description: "",
    imageUrl: "",
    status: "active",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const eventData = await getEvent(eventId);
        setFormData({
          ...eventData,
          releaseDate: formatDate(eventData.releaseDate),
          startDate: formatDate(eventData.startDate),
          deadline: formatDate(eventData.deadline),
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, [eventId]);

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
      console.error("No token found, user might not be authenticated.");
      return;
    }

    try {
      const data = await updateEvent(eventId, formData, token);
      console.log(data);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle error (e.g., show an error message)
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className={title()}>Edit Event</h1>
      <div className="mt-10 sm:mt-32">
        <form
          className="w-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <Input
              isRequired
              type="text"
              label="Title"
              labelPlacement="outside"
              placeholder="New Event"
              className="max-w-xs"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="text"
              label="Location"
              labelPlacement="outside"
              placeholder="Location"
              className="max-w-xs"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="date"
              label="Release Date"
              labelPlacement="outside"
              placeholder="Release Date"
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
              label="Start Date"
              labelPlacement="outside"
              placeholder="Start Date"
              className="max-w-xs"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="date"
              label="Deadline"
              labelPlacement="outside"
              placeholder="Deadline"
              className="max-w-xs"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
            <div className="max-w-xs flex flex-row justify-between items-center">
              <Input
                isRequired
                type="text"
                label="Image URL"
                labelPlacement="outside"
                placeholder="Image URL"
                className="w-52 mr-2"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <Select
                className="w-32"
                label="Status"
                labelPlacement="outside"
                placeholder="Select Status"
                value={formData.status}
                onChange={(e) => handleSelectChange(e.target.value)}
              >
                <SelectItem key="active" value="active">
                  Active
                </SelectItem>
                <SelectItem key="paused" value="paused">
                  Paused
                </SelectItem>
                <SelectItem key="closed" value="closed">
                  Closed
                </SelectItem>
              </Select>
            </div>
          </div>
          <Textarea
            isRequired
            label="Description"
            labelPlacement="outside"
            placeholder="Enter event description"
            className="w-full"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Button type="submit">Update Event</Button>
        </form>
      </div>
    </div>
  );
}
