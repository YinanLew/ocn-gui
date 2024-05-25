export const getEvents = async () => {
  try {
    const res = await fetch("https://ocn-data.vercel.app/events"); // Replace with your actual API endpoint
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
