export const getEvent = async (eventId: string) => {
    try {
      const res = await fetch(`http://localhost:8500/events/${eventId}`); // Replace with your actual API endpoint
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };