export const getApplicationByUniqueId = async (
  eventUniqueId: string,
  token: string
): Promise<any> => {
  try {
    const res = await fetch(
      `http://localhost:8500/application/event-sub/${eventUniqueId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
