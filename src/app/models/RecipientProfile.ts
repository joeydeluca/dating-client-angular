import {Profile} from './Profile';
import {Photo} from './Photo';

export class RecipientProfile {
    userId: number;
    username: string;
    profile: Profile;
    age: number;
    profilePhotoUrl: string;
    genderSeeking: string;
}
