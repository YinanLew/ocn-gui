export const getApplicationsById = async (
  uniqueId: string,
  token: string
): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:8500/application/${uniqueId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
