import {Component, OnInit} from "@angular/core";
import {RecipientProfileService} from "../services/recipient-profile.service";
import {RecipientProfile} from "../models/RecipientProfile";
import {MdSnackBar} from "@angular/material";
import {AuthService} from "../services/auth.service";
import {SharedService} from "../services/shared.service";
import {Favorites} from "../models/Favorites";
import {ProfileEvent} from "../models/ProfileEvent";


@Component({
  selector: 'favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
    favoritedProfiles: ProfileEvent[];
    favoritedMeProfiles: ProfileEvent[];

    emptyListMessageMyFavorites: string;
    emptyListMessageFavoritedMe: string;

    constructor(private recipientProfileService: RecipientProfileService, private snackBar: MdSnackBar) {

    }

    ngOnInit() {
        SharedService.showLoader.next(true);
        this.recipientProfileService.getFavorites().subscribe(
            (result) => {
                this.favoritedMeProfiles = result.favoritedMe;
                this.favoritedProfiles = result.myFavorites;

                if(this.favoritedMeProfiles.length === 0) {
                    this.emptyListMessageFavoritedMe = "No one has favorited you";
                }
                if(this.favoritedProfiles.length === 0) {
                    this.emptyListMessageMyFavorites = "You have not added anyone to your favorites list";
                }

                SharedService.showLoader.next(false);
            }, 
            () => {
                SharedService.showLoader.next(false);
                this.handleError("Error loading list");
            }
        );
    }

    onDelete(userId: number): void {
        SharedService.showLoader.next(true);
        this.recipientProfileService.deleteFavorite(userId).subscribe(
            () => {
                SharedService.showLoader.next(false);
                this.handleSuccess("Done");

                this.ngOnInit();
            },
            () => {
                SharedService.showLoader.next(false);
                this.handleError("Unable to complete request");
            }
        );
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