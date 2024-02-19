import { ApplicationFormData } from "@/types";
export const updateApplicationByUniqueId = async (
  eventUniqueId: string,
  eventData: ApplicationFormData,
  token: string | undefined
) => {
  const res = await fetch(
    `http://localhost:8500/application/edit/${eventUniqueId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for authentication
      },
      body: JSON.stringify(eventData),
    }
  );
  if (res.status === 401) {
    // Handle token expiration or unauthorized access specifically
    throw new Error("Token expired");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update the event");
  }

  return res.json();
};
