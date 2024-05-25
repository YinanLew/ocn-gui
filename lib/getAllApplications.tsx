export const getAllApplications = async (token: string): Promise<any> => {
  try {
    const res = await fetch(`https://ocn-data.onrender.com/application/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
