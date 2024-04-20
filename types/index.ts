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
  certificateStatus: string;
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
  userId: string;
  email: string;
  events: FlatEvent[];
}

export interface FlattenedApplication
  extends Omit<OriginalApplication, "events"> {
  eventId: string;
  status: string;
  eventTitle: string;
  eventUniqueId: string;
  certificateStatus: string;
}

export interface UsersTableTempProps {
  applications: FlattenedApplication[];
  onRemoveApplication: (eventObjectId: string) => void;
  onIssueCertificate: (
    eventId: string,
    userId: string,
    token: string | undefined
  ) => void;
  onRejectCertificate: (
    eventId: string,
    userId: string,
    token: string | undefined
  ) => void;
}

export interface EventWorkingHours {
  _id: string;
  eventTitle: string;
  totalHours: number;
  status: string;
  appCreatedAt: string;
  certificateStatus: string;
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

export type LocalizationStrings = {
  login: string;
  logout: string;
  apply: string;
  closed: string;
  event: string;
  location: string;
  releaseDate: string;
  startDate: string;
  deadline: string;
  applicationCount: string;
  totalWorkingHours: string;
  status: string;
  actions: string;
  columns: string;
  addNew: string;
  total: string;
  rpp: string;
  previous: string;
  next: string;
  appCreatedAt: string;
  myApps: string;
  allApps: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  spokenLanguage: string;
  writtenLanguage: string;
  certificateStatus: string;
  workingHours: string;
  search: string;
  image: string;
  verified: string;
  active: string;
  paused: string;
  closedStatus: string;
  notSubmitted: string;
  submitted: string;
  approved: string;
  rejected: string;
  appRejected: string;
  description: string;
  create: string;
  view: string;
  edit: string;
  delete: string;
  pending: string;
  referral: string;
  experiences: string;
  skills: string;
  motivations: string;
};

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
  strings: LocalizationStrings;
  siteConfig: SiteConfig;
};

export type TableColumnTy = {
  name: string;
  uid: string;
  sortable: boolean;
};
