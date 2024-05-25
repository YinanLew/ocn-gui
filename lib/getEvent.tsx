export const getEvent = async (eventId: string) => {
  try {
    const res = await fetch(`https://ocn-data.vercel.app/events/${eventId}`); // Replace with your actual API endpoint
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
