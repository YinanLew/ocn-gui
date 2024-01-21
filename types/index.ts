import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: string;
};

export type Params = {
  params: {
    eventId: string;
  };
};
