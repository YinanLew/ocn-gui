import { EventEntry } from "@/types";

export const updateWorkingEntryById = async (
  id: string,
  formData: EventEntry,
  token: string
): Promise<any> => {
  try {
    const res = await fetch(
      `http://localhost:8500/working-hours/working-entry/${id}`,
      {
        method: "PUT",
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
    if (res.status === 403) {
      throw new Error("Not Admin");
    }
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
