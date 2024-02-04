export const getAllApplications = async () => {
  try {
    const res = await fetch(`http://localhost:8500/application/`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
