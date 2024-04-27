"use client";
import { title } from "@/components/primitives";
import { getEvent } from "@/lib/getEvent";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/utils/languageContext";
import { ApplicationFormData, Event, Params } from "@/types";
import { Button } from "@nextui-org/react";
import { formatDate } from "@/utils/formatDate";
import ApplicationForm from "@/components/applicationForm";
import { useRouter } from "next/navigation";
import { AuthRequiredError } from "@/lib/exceptions";
import { submitApplication } from "@/lib/submitApplication";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  WeiboShareButton,
} from "react-share";

export default function EventPage({ params: { eventId } }: Params) {
  const [event, setEvent] = useState<Event>();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { translations } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData); // Ensure the fallback to an empty array
        setError("");
      } catch (error) {
        setError(`Error: ${error}`);
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, [eventId]);

  const handleApplyClick = async () => {
    if (!session) {
      throw new AuthRequiredError();
    }

    const applicationData = {
      eventId: eventId,
    };

    try {
      await submitApplication(applicationData, session.user.token);
      router.push("/events");
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof Error && error.message === "Token expired") {
        // Handle token expiration
        signOut({ redirect: false });
        setError("Your session has expired. Please log in again.");
      } else {
        // Handle other errors
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    }
  };

  const handleFormSubmit = async (
    eventId: string,
    applicationData: ApplicationFormData
  ) => {
    try {
      await submitApplication({ ...applicationData, eventId });
      router.push("/events");
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError("An unexpected error occurred during application submission.");
      }
    }
  };

  const formatDescription = (text: string) => {
    return text.split("\n").map((paragraph, index) =>
      paragraph.trim() ? (
        <p className="mb-4" key={index}>
          {paragraph}
        </p>
      ) : null
    );
  };

  if (status === "loading") {
    return <div className={title()}>Loading...</div>;
  }

  if (error) {
    throw new Error(error);
  }

  const isEventClosed = event?.status === "closed";
  const shouldShowApplication = !session && !isEventClosed;
  console.log(event?.imageUrl);

  return (
    <div className="flex flex-col items-center w-full my-4 px-4">
      {event?.imageUrl && (
        <img
          src={event.imageUrl}
          alt="Event Image"
          className="w-full max-w-md h-auto rounded-lg mb-4"
        />
      )}
      <div className="w-4/5 text-center space-y-2">
        <div className="w-full pb-8">
          <h1 className={title()}>{event?.title}</h1>
        </div>
        <div className="w-full flex flex-row justify-between items-center pb-4">
          <h2>
            {translations.strings.location}: {event?.location}
          </h2>
          <h2>
            {translations.strings.startDate}: {formatDate(event?.releaseDate)}
          </h2>
          <h2>
            {translations.strings.status}: {event?.status}
          </h2>
        </div>
        <div className="flex justify-center space-x-4">
          <WeiboShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`}
            title={event?.title}
            image={event?.imageUrl}
          >
            <WeiboIcon size={32} round />
          </WeiboShareButton>
          <TwitterShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`}
            title={event?.title}
          >
            <XIcon size={32} round />
          </TwitterShareButton>
          <FacebookShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`}
            title={event?.title}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <EmailShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`}
            title={event?.title}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>

        <div className="w-full text-justify">
          {event && formatDescription(event.description)}
        </div>
        {isEventClosed ? (
          <p className={title()}>{translations.strings.closed}</p>
        ) : shouldShowApplication ? (
          <ApplicationForm eventId={eventId} onSubmit={handleFormSubmit} />
        ) : session ? (
          <Button onClick={handleApplyClick}>
            {translations.strings.apply}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
