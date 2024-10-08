export const updateCertificateStatus = async (
  eventId: string,
  userId: string,
  newStatus: string,
  token: string
) => {
  try {
    const res = await fetch(
      `https://ocn-data.onrender.com/working-hours/updateCertificateStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          userId,
          certificateStatus: newStatus,
        }),
      }
    );
    if (res.status === 401) {
      throw new Error("Token expired");
    }
    if (res.status === 403) {
      throw new Error("Not Admin");
    }
    if (!res.ok) throw new Error("Failed to fetch events");
    return { success: res.ok };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
