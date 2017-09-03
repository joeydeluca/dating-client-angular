import {City, Region, Country} from "./Location";

export class ProfileEvent {
    userId: number;
    username: string;
    age: number;
    profilePhotoUrl: string;
    eventCreatedDate: string;
    country: Country;
    region: Region;
    city: City;
}