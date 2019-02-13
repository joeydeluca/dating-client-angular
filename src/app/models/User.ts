import {Profile} from './Profile';

export class User {
  id: number;
  gender: string;
  genderSeeking: string;
  email: string;
  username: string;
  profile: Profile;
  birthDate: string;
  isPaid: boolean;
  createdDate: string;
  emailSubscription: EmailSubscription = new EmailSubscription();
}

export class EmailSubscription {
  isSubscribedNewMailAlert: boolean;
  isSubscribedNewFlirtAlert: boolean;
  isSubscribedFavoritedMeAlert: boolean;
}
