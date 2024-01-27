import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  releaseDate: string;
  startDate: string;
  deadline: string;
  location: string;
  imageUrl: string;
  status: string;
};

export type EventFormData = Omit<Event, "_id"> & {
  _id?: string;
};

export type ApplicationFormData = {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  spokenLanguage: string;
  writtenLanguage: string;
  volunteerExperience: string;
  referralSource?: string;
  referralContactPhoneNumber?: string;
  skillsAndExpertise?: string;
  motivationToVolunteer?: string;
};

export type Params = {
  params: {
    eventId: string;
  };
};
