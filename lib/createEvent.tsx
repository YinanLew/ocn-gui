export const createEvent = async (formData: any, token: string) => {
  try {
    const response = await fetch("http://localhost:8500/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the response data
  } catch (error) {
    console.error("Error creating event:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};
