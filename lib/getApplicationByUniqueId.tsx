export const getApplicationByUniqueId = async (eventUniqueId: string) => {
  try {
    const res = await fetch(
      `http://localhost:8500/application/event-sub/${eventUniqueId}`
    ); // Replace with your actual API endpoint
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
