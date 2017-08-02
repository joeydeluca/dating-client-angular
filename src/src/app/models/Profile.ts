import {City, Region, Country} from "./Location";

export class Profile {
  city: City;
  region: Region;
  country: Country;
  height: Height;
  zip: string;
  bodyType: string;
  partnerBodyType: string;
  smoke: string;
  partnerSmoke: string;
  drink: string;
  partnerDrink: string;
  hairColor: string;
  partnerHairColor: string;
  religion: string;
  partnerReligion: string;
  pet: string;
  partnerPet: string;
  language: string;
  partnerLanguage: string;
  ethnicity: string;
  partnerEthnicity: string;
  occupation: string;
  partnerOccupation: string;
  salary: string;
  partnerSalary: string;
  childrenStatus: string;
  partnerChildrenStatus: string
  astroSign: string;
  partnerAstroSign: string;
  education: string;
  partnerEducation: string;
  eyeColor: string;
  partnerEyeColor: string;
  aboutMe: string;
  partnerDescription: string;
  perfectDate: string;
}

export class Height {
  feet: string;
  inches: string;
}
