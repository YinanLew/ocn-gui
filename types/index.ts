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
    eventUniqueId: string;
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
}
