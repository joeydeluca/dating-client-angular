import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {trigger, transition, style, animate } from '@angular/animations';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {PhotoService} from '../services/photo.service';
import {MatSnackBar} from '@angular/material/snack-bar';
//import { FileUploader, Headers, FileUploaderOptions } from 'ng2-file-upload';
import {AuthService} from '../services/auth.service';
import {SharedService} from '../services/shared.service';
import {Photo} from '../models/Photo';
import {Router} from '@angular/router';


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
