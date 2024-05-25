export const getUserApplications = async (token: string): Promise<any> => {
  try {
    const res = await fetch(
      `https://ocn-data.vercel.app/working-hours/my-applications`,
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
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
