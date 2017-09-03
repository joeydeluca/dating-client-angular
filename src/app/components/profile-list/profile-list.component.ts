import {Component, OnInit, Input} from "@angular/core";
import {RecipientProfileService} from "../../services/recipient-profile.service";
import {ProfileEvent} from "../../models/ProfileEvent";
import {MdSnackBar} from "@angular/material";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
    @Input() list: ProfileEvent[];
    @Input() emptyListMessage: string;

    constructor() {

    }

    ngOnInit() {

    }

}