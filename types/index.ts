import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EventFormData {
  title: string;
  description: string;
  releaseDate: string;
  startDate: string;
  deadline: string;
  location: string;
  imageUrl: string;
  status: string;
}

export interface Event extends EventFormData {
  _id: string;
  applicationCount: string;
}

export interface Application {
  eventId?: string;
  eventTitle?: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  spokenLanguage: string;
  writtenLanguage: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationFormData extends Application {
  title?: string;
  volunteerExperience: string;
  referralSource?: string;
  referralContactPhoneNumber?: string;
  skillsAndExpertise?: string;
  motivationToVolunteer?: string;
}

export type Params = {
  params: {
    eventId: string;
    uniqueId: string;
  };
};

export interface FlatEvent {
  eventId: string;
  status: string;
  eventTitle: string;
  _id: string;
}

export interface OriginalApplication {
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  spokenLanguage: string;
  writtenLanguage: string;
  createdAt: string;
  email: string;
  events: FlatEvent[];
}

export interface FlattenedApplication
  extends Omit<OriginalApplication, "events"> {
  eventId: string;
  status: string;
  eventTitle: string;
  eventUniqueId: string;
}

export interface UsersTableTempProps {
  applications: FlattenedApplication[];
  onRemoveApplication: (eventId: string) => void;
}

export interface EventWorkingHours {
  _id: string;
  eventTitle: string;
  totalHours: number;
  status: string;
  appCreatedAt: string;
}

export interface AppsTableProps {
  apps: EventWorkingHours[];
}

export interface EventEntry {
  _id: string;
  eventId?: string;
  eventTitle: string;
  startTime: string;
  endTime: string;
  hours: string;
  status: string;
  userName?: string;
}

export interface WorkingHoursTableProps {
  apps: EventEntry[];
  eventId: string;
}

export type SiteConfig = {
  name: string;
  description: string;
  navItems: { label: string; href: string }[];
  navMenuItems: { label: string; href: string }[];
  links: {
    github: string;
    twitter: string;
    docs: string;
    discord: string;
    sponsor: string;
  };
};

export type Translations = {
  [key: string]: string | SiteConfig;
};
