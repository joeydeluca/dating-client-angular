import {User} from './User';

export class Message {
    id: number;
    fromUser: User;
    toUser: User;
    message: string;
    sendDate: string;
    readDate: string;
}
