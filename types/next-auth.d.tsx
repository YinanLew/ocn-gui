// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userInfo: {
        _id: string;
        user: string;
        event: string;
        firstName: string;
        lastName: string;
        address: string;
        phoneNumber: string;
        spokenLanguage: string;
        writtenLanguage: string;
        volunteerExperience: string;
        referralSource: string;
        referralContactPhoneNumber: string;
        skillsAndExpertise: string;
        motivationToVolunteer: string;
        __v: number;
      };
      role: string;
    };
  }
}
