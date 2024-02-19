import { ApplicationFormData } from "@/types";

export const submitApplication = async (
  applicationData: ApplicationFormData | { eventId: string },
  token?: string
): Promise<any> => {
  const headers: {
    "Content-Type": string;
    [key: string]: string;
  } = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch("http://localhost:8500/application/submit", {
      method: "POST",
      headers,
      body: JSON.stringify(applicationData),
    });

    if (res.status === 401) {
      throw new Error("Token expired");
    }

    if (!res.ok) {
      const errorResponse = await res.json();
      console.log(errorResponse);
      throw new Error(`${errorResponse.message}`);
    }

    const result = await res.json();
    console.log("Application submitted successfully", result);
    return result;
  } catch (error) {
    console.error("Failed to submit application:", error);
    throw error;
  }
};
