"use client";
import { Link } from "@nextui-org/link";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      {error.message || "Something went wrong"}
      {error.message === "Your session has expired. Please log in again." ||
      "Access denied: Not an admin." ? (
        <Link href="/login">Log In</Link>
      ) : (
        <button onClick={reset}>Try again</button>
      )}
    </div>
  );
};

export default error;
