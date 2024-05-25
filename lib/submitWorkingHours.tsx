import { EventEntry } from "@/types";

export const submitWorkingHours = async (
  formData: Partial<EventEntry>,
  token: string,
  eventId: string
): Promise<any> => {
  try {
    const res = await fetch(
      `https://ocn-data.onrender.com/working-hours/submit-entry/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    if (res.status === 401) {
      throw new Error("Token expired");
    }
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
