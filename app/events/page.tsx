"use client";
import { title } from "@/components/primitives";
import TableTemp from "@/components/table";
import { useLanguage } from "@/utils/languageContext";

export default function EventsPage() {
  const { translations } = useLanguage();

  return (
    <div>
      <h1 className={title()}>{translations.strings.event}</h1>
      <div className="mt-2">
        <TableTemp />
      </div>
    </div>
  );
}
