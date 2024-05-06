"use client";
import { Link } from "@nextui-org/link";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      {error.message || "Something went wrong"}
      {error.message === "Start time must be earlier than end time." ? (
        <button onClick={reset}>Try again</button>
      ) : (
        <Link href="/api/auth/signin">Log In</Link>
      )}
    </div>
  );
};

export default error;
