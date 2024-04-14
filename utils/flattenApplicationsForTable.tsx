import { OriginalApplication, FlattenedApplication } from "@/types";

export const flattenApplicationsForTable = (
  originalApplications: OriginalApplication[]
): FlattenedApplication[] => {
  // Use reduce to accumulate a flat list of application-event objects
  return originalApplications.reduce<FlattenedApplication[]>(
    (acc, application) => {
      // For each event in the current application, create a new object that merges application and event properties
      const flattenedEvents = application.events
        .map((event) => ({
          ...application,
          eventId: event.eventId, // Take eventId directly from the event
          status: event.status, // Event-specific status
          eventTitle: event.eventTitle, // Event title
          eventUniqueId: event._id,
          certificateStatus: event.certificateStatus,
          // Explicitly exclude the 'events' array to avoid confusion
        }))
        .map(({ events, ...rest }) => rest); // Exclude the 'events' property from the final objects

      // Combine the current flattened events with the accumulator
      return acc.concat(flattenedEvents);
    },
    []
  );
};
