"use client";
import { getEvents } from "@/lib/getEvents";
import { useLanguage } from "@/utils/languageContext";
import { Link } from "@nextui-org/link";
import { useEffect, useState } from "react";
import { Event } from "@/types";

export default function Home() {
  const { translations } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData || []); // Ensure the fallback to an empty array
      } catch (error) {
        // setError("error");
      }
    }
    fetchData();
  }, []);

  const latestEvents = events
    .sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    })
    .slice(0, 3);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center"></div>
      <h1 className="text-4xl font-bold text-center">
        {translations.strings.homepageTitle}
      </h1>
      <p className="text-xl text-center">{translations.strings.homepageSub}</p>

      <div className="max-w-md">
        <Link href="https://oakvillechinesenetwork.ca/">
          <img
            src="https://i.imgur.com/Z3y7oen.png"
            alt="志愿者在工作"
            className="rounded-lg shadow-lg"
          />
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-20">
        <div className="bg-white p-6 rounded-lg shadow-md sm:w-5/12">
          <h2 className="text-2xl font-semibold">
            {translations.strings.homepageListTitle}
          </h2>
          <ul className="list-disc p-2">
            {latestEvents.map((event) => (
              <li
                key={event._id}
                className="flex justify-between items-center my-1"
              >
                <div className="flex-grow text-left">{event.title}</div>
                <div className="flex-shrink-0 text-right">
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </li>
            ))}
          </ul>
          {/* <Link
            href="/events"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {translations.strings.homepageListBtn}
          </Link> */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md sm:w-6/12 md:w-11/20">
          <h2 className="text-2xl font-semibold">
            {translations.strings.howToJoin}
          </h2>
          <p>{translations.strings.howToSub}</p>
          <Link
            href="/events"
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {translations.strings.event}
          </Link>
        </div>
      </div>

      <div className="max-w-lg text-center">
        <h2 className="text-2xl font-semibold">
          {translations.strings.homepageStory}
        </h2>
        <p className="italic">
          “参与公园清理活动不仅让我贡献了一份力量，还结识了许多朋友，一起努力让城市更美好！”
        </p>
        <p className="text-sm">— 李华，志愿者</p>
      </div>
      <div className="mt-8"></div>
    </section>
  );
}
