import { ApplicationFormData } from "@/types";
export const updateApplicationByUniqueId = async (
  eventId: string,
  eventData: ApplicationFormData,
  token: string
) => {
  const response = await fetch(`http://localhost:8500/events/edit/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Assuming you're using JWT for authentication
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update the event");
  }

  return response.json();
};
