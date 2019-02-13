import {Component, OnInit} from '@angular/core';
import {RecipientProfileService} from '../services/recipient-profile.service';
import {Message} from '../models/Message';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {SharedService} from '../services/shared.service';
import {Observable} from 'rxjs';



@Component({
  selector: 'view-conversation',
  templateUrl: './view-conversation.component.html',
  styleUrls: ['./view-conversation.component.css']
})
export class ViewConversationComponent implements OnInit {
    messages: Message[];
    recipientUsername: string;
    recipientProfileId: number;
    userId: number;
    newMessageText: string;
    isSending: boolean;
    isUnreadMessages: boolean;

    constructor(
        private route: ActivatedRoute,
        private recipientProfileService: RecipientProfileService,
        private authService: AuthService,
        private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.recipientProfileId = +params['recipientUserId'];
                this.loadMessages(this.recipientProfileService.getMessages());
        });
    }

    loadMessages(messages: Observable<Message[]>): void {
        SharedService.showLoader.next(true);
         messages.subscribe(
                    (result) => {
                        const messagesToDisplay: Message[] = [];

                        if (!result) {
                            this.handleError('Something went wrong :(');
                            return;
                        }

                        result.forEach((message: Message) => {
                            if (message.fromUser.id === this.recipientProfileId || message.toUser.id === this.recipientProfileId) {
                                messagesToDisplay.push(message);
                                if (!message.readDate && message.fromUser.id === this.recipientProfileId) {
                                    this.isUnreadMessages = true;
                                }
                            }
                        });

                        if (!messagesToDisplay) {
                            this.handleError('Something went wrong :(');
                            return;
                        }

                        if (messagesToDisplay[0].fromUser.id === this.authService.getAuthContext().userId) {
                            this.recipientUsername = messagesToDisplay[0].toUser.username;
                        } else {
                            this.recipientUsername = messagesToDisplay[0].fromUser.username;
                        }

                        this.userId = this.authService.getAuthContext().userId;

                        messagesToDisplay.sort((a, b) => {
                            if (a.id < b.id) { return 1; } else if (a.id > b.id) { return -1; } else { return 0; }
                        });

                        this.messages = messagesToDisplay;

                        if (this.isUnreadMessages) {
                            this.recipientProfileService.markMessagesAsRead(this.recipientProfileId).subscribe();
                        }
                        SharedService.showLoader.next(false);
                    },
                    () => {
                        this.handleError('Failed to retrieve messages');
                        SharedService.showLoader.next(false);
                    }
                );
    }

    sendMessage(): void {
        if (!this.newMessageText) {
            return;
        }

        this.isSending = true;
        SharedService.showLoader.next(true);
        this.recipientProfileService.sendMessage(this.recipientProfileId, this.newMessageText)
        .subscribe(() => {
            SharedService.showLoader.next(false);
            this.handleSuccess('Message sent');
            this.isSending = false;
            this.newMessageText = '';
            this.loadMessages(this.recipientProfileService.getMessages());
        },
        (error) => {
            SharedService.showLoader.next(false);
            console.error(error);
            this.handleError('Failed to send message');
            this.isSending = false;
        });
    }

    private handleError(message: string): void {
        this.snackBar.open(message, null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
        });
    }

    private handleSuccess(message: string): void {
        this.snackBar.open(message, null, {
            duration: 4000,
            panelClass: ['bg-success', 'snackbar']
        });
    }
}
