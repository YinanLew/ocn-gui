export const setNewPassword = async (
  token: string,
  newPassword: string
): Promise<string> => {
  try {
    const response = await fetch(`https://ocn-data.vercel.app/users/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid action or token.");
      }
      if (response.status === 404) {
        throw new Error("User not found.");
      }
      throw new Error("Failed to set new password.");
    }

    return response.text(); // Assuming the API returns a text response
  } catch (error) {
    console.error("Error setting new password:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
