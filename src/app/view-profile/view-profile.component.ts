import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {RecipientProfileService} from "../services/recipient-profile.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {RecipientProfile} from "../models/RecipientProfile";
import {SharedService} from "../services/shared.service";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  recipientProfile: RecipientProfile;

  nullEssayText: string = "Contact me to find out";

  newMessageText: string;
  isSendingMessage: boolean;
  
  constructor(
    private router: Router ,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private recipientProfileService: RecipientProfileService,
    private authService: AuthService) {
      window.scrollTo(0, 0);
  }

  ngOnInit(): void {
     SharedService.showLoader.next(true);

    this.route.params.subscribe((params: Params) => {
      let recipientProfileId = +params['id'];
      this.recipientProfileService.getRecipientProfile(recipientProfileId)
      .subscribe(
        (result) => {
          this.recipientProfile = result;
           SharedService.showLoader.next(false);
        },
        (error) => {
          console.error(error);
          this.handleError('Error loading profile');
           SharedService.showLoader.next(false);
        })
    });
  }

  getEssayText(input): string {
    return input ? input : this.nullEssayText;
  }

  sendFlirt(recipientUserId: number, recipientUsername: string): void {
    SharedService.showLoader.next(true);
    this.recipientProfileService.sendFlirt(recipientUserId)
      .subscribe(() => {
        SharedService.showLoader.next(false);
        this.handleSuccess(`You sent a flirt to ${recipientUsername}`);
      }, 
      (error) => {
        SharedService.showLoader.next(false);
        console.error(error);
        this.handleError('Error sending flirt');
      });
  }

  addFavorite(recipientUserId: number, recipientUsername: string): void {
    SharedService.showLoader.next(true);
    this.recipientProfileService.addFavorite(recipientUserId)
      .subscribe(() => {
        SharedService.showLoader.next(false);
        this.handleSuccess(`You favorited ${recipientUsername}`);
      }, 
      (error) => {
        SharedService.showLoader.next(false);
         this.handleError(error);
      });
  }

  sendMessage(): void {
    if(!this.newMessageText) {
      return;
    }

    if(!this.authService.getAuthContext().paid) {
      this.snackBar.open('This feature requires an upgraded membership', null, {
        duration: 4000,
        extraClasses: ['bg-warning', 'snackbar']
      });
      this.router.navigate(['/upgrade']);
      return;
    }

    this.isSendingMessage = true;
    SharedService.showLoader.next(true);
    this.recipientProfileService.sendMessage(this.recipientProfile.userId, this.newMessageText)
    .subscribe(() => {
        SharedService.showLoader.next(false);
        this.handleSuccess("Message sent");
        this.isSendingMessage = false;
        this.newMessageText = "";
        this.recipientProfileService.getMessages().subscribe();
    }, 
    (error) => {
        SharedService.showLoader.next(false);
        console.error(error);
        this.handleError("Failed to send message");
        this.isSendingMessage = false;
    });
    }

    private handleError(message: string): void {
      this.snackBar.open(message, null, {
          duration: 4000,
          extraClasses: ['bg-danger', 'snackbar']
      });
    }

    private handleSuccess(message: string): void {
      this.snackBar.open(message, null, {
          duration: 4000,
          extraClasses: ['bg-success', 'snackbar']
      });
    }

}
