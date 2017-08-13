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


@Component({
  selector: 'join-upload-photo',
  templateUrl: './join-upload-photo.component.html',
  styleUrls: ['./join-upload-photo.component.css'],
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      )]
    )
  ]
})
export class JoinUploadPhotoComponent {
  cropper: Cropper;

  public isUploading: boolean = false;
  public isCroppingView: boolean = false;
  
  @ViewChild('file') fileSelector: ElementRef;
  @ViewChild('image') imageSelector: ElementRef;

  photo: Photo;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MdSnackBar,
              private authService: AuthService,
              private photoService: PhotoService) {
  }

  upload() {
    SharedService.showLoader.next(true);
    this.isUploading = true;
    let formData = new FormData();
    this.photoService.uploadPhoto(this.fileSelector.nativeElement.files.item(0))
      .subscribe(
        (uploadPhotoResponse) => {
          this.photo = uploadPhotoResponse;
          SharedService.showLoader.next(false);
          this.isUploading = false;
          this.isCroppingView = true;
        },
        (error) => {
          this.snackBar.open(error, null, {
                duration: 8000,
                extraClasses: ['bg-danger', 'snackbar']
          });
          this.isUploading = false;
          SharedService.showLoader.next(false);
      })
  }

  initCropper(): void {
    this.cropper = new Cropper(this.imageSelector.nativeElement, {
        aspectRatio: 9 / 9,
        scalable: false,
        preview: '.preview',
        viewMode: 2,
        responsive: true,
        movable: false,
        zoomable: false,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
        checkCrossOrigin: false,
        restore: true
    });
  }

  crop(): void {
    SharedService.showLoader.next(true);
    const data = this.cropper.getData();
    this.photoService.cropPhoto(this.photo.id, data.x, data.y, data.width, data.height)
    .subscribe(
      () => {
        SharedService.showLoader.next(false);
        alert('success');
      }, 
      (error) => {
        SharedService.showLoader.next(false);
        this.snackBar.open(error, null, {
                duration: 8000,
                extraClasses: ['bg-danger', 'snackbar']
        });
      }
    )
  }

}
