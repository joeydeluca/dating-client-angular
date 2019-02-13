import {Component, OnInit} from "@angular/core";
import {RecipientProfileService} from "../services/recipient-profile.service";
import {RecipientProfile} from "../models/RecipientProfile";
import {MatSnackBar} from "@angular/material";
import {AuthService} from "../services/auth.service";
import {SharedService} from "../services/shared.service";
import {Favorites} from "../models/Favorites";
import {ProfileEvent} from "../models/ProfileEvent";


@Component({
  selector: 'profile-views',
  templateUrl: './profile-views.component.html',
  styleUrls: ['./profile-views.component.css']
})
export class ProfileViewsComponent implements OnInit {
    items: ProfileEvent[];
    emptyListMessage: string;

    constructor(private recipientProfileService: RecipientProfileService, private snackBar: MatSnackBar) {

    }

    ngOnInit() {
        SharedService.showLoader.next(true);
        this.recipientProfileService.getProfileViews().subscribe(
            (result) => {
                this.items = result;

                if(this.items.length === 0) {
                    this.emptyListMessage = "No one has viewed your profile";
                }

                SharedService.showLoader.next(false);
            }, 
            () => {
                SharedService.showLoader.next(false);
                this.handleError("Error loading list");
            }
        );
    }

    private handleError(message: string): void {
        this.snackBar.open(message, null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
        });
    }


}