import {Component, OnInit, ViewChild, ElementRef, trigger, transition, style, animate} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../services/user.service";
import {PhotoService} from "../services/photo.service";
import {MdSnackBar} from "@angular/material";
import * as Cropper from 'cropperjs';
import { FileUploader, Headers, FileUploaderOptions } from 'ng2-file-upload';
import {AuthService} from "../services/auth.service";
import {SharedService} from "../services/shared.service";
import {Photo} from "../models/photo";
import {Router} from "@angular/router";


@Component({
  selector: 'join-upload-photo',
  templateUrl: './join-upload-photo.component.html',
  styleUrls: ['./join-upload-photo.component.css'],
})
export class JoinUploadPhotoComponent {

  constructor(
              private photoService: PhotoService,
              private userService: UserService,
              private router: Router) {
  }

  onPhotoUploadSuccess(photo: Photo): void {
    this.photoService.setProfilePhoto(photo.id).subscribe(() => {
      this.userService.getUserFromServer()
        .subscribe();
    });
    this.router.navigate(['/search']);
  }

}
