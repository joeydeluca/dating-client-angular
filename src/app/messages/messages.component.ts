import {Component, OnInit} from "@angular/core";
import {RecipientProfileService} from "../services/recipient-profile.service";
import {Message} from "../models/Message";
import {MatSnackBar} from "@angular/material";
import {AuthService} from "../services/auth.service";
import {SharedService} from "../services/shared.service";
import {Router} from "@angular/router";


@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    items: any = {};
    keys = [];
    displayZeroStateMessage: boolean = false;

  constructor(
        private recipientProfileService: RecipientProfileService, 
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router) {
  }

  ngOnInit() {
    SharedService.showLoader.next(true);
    this.recipientProfileService.getMessages().subscribe(
        (result) => {
            this.setItems(result);
            SharedService.showLoader.next(false);
        }, 
        () => {
            this.handleError("Failed to retrieve messages");
            SharedService.showLoader.next(false);
        }
    );
  }

  setItems(messages: Message[]) {
    messages.forEach((message: Message) => {
        const isOutgoingMessage: boolean = message.fromUser.id == this.authService.getAuthContext().userId;
        const recipientUser = isOutgoingMessage ? message.toUser : message.fromUser;

        let conversation: Conversation = this.items[recipientUser.id];
        if(!conversation) {
            conversation = new Conversation();
            conversation.recipientUsername = recipientUser.username;
            conversation.recipientProfilePhotoUrl = recipientUser.profile.profilePhotoUrl;
            conversation.recipientUserId = recipientUser.id;
        }

        conversation.lastMessageDate = message.sendDate;
        conversation.lastMessageId = message.id;

        if(isOutgoingMessage) {
            conversation.numberOfSentMessages++;
        }
        else if(!message.readDate) {
            conversation.numberOfUnreadMessagesReceived++;
        }

        this.items[recipientUser.id] = conversation;
    });

    // I want to sort the keys by the lastMessageId, there is probably a better way fo doing this but whatevs.
    this.keys = this.generateKeys();
    this.sortKeys();

    if(this.keys && this.keys.length === 0) {
        this.displayZeroStateMessage = true;
    }
  }

  private generateKeys(): any {
    const keyList = [];
    for(var key in this.items) {
        if(this.items.hasOwnProperty(key)) {
            keyList.push({messageId: this.items[key].lastMessageId, userId: key});
        }
    }
    return keyList;
  }

  private sortKeys() {
    this.keys.sort((a, b) => {
        if (a.messageId < b.messageId) return 1;
        else if (a.messageId > b.messageId) return -1;
        else return 0;
    });
  }

  private handleError(message: string): void {
    this.snackBar.open(message, null, {
        duration: 4000,
        panelClass: ['bg-danger', 'snackbar']
    });
  }
}

export class Conversation {
    recipientUserId: number;
    recipientProfilePhotoUrl: string;
    recipientUsername: string;
    numberOfUnreadMessagesReceived: number = 0;
    numberOfSentMessages: number = 0;
    lastMessageDate: string;
    lastMessageId: number;
}
