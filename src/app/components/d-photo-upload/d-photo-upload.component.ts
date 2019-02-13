import {Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {trigger, transition, style, animate } from '@angular/animations';
import Cropper from 'cropperjs/dist/cropper.esm.js';
import {Photo} from '../../models/Photo';
import {SharedService} from '../../services/shared.service';
import {PhotoService} from '../../services/photo.service';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'd-photo-upload',
  templateUrl: './d-photo-upload.component.html',
  styleUrls: ['./d-photo-upload.component.css'],
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
export class DPhotoUploadComponent {
  cropper: Cropper;
  isUploading = false;
  isCroppingView = false;
  photo: Photo;
  @ViewChild('file') fileSelector: ElementRef;
  @ViewChild('image') imageSelector: ElementRef;

  @Output()
  complete = new EventEmitter<Photo>();

  constructor(
      private snackBar: MatSnackBar,
      private photoService: PhotoService
      ) {
  }

  upload() {
    SharedService.showLoader.next(true);
    this.isUploading = true;
    const formData = new FormData();
    this.photoService.uploadPhoto(this.fileSelector.nativeElement.files.item(0))
      .subscribe(
        (uploadPhotoResponse) => {
          this.photo = uploadPhotoResponse;
          SharedService.showLoader.next(false);
          this.isUploading = false;
          this.isCroppingView = true;
          this.fileSelector.nativeElement.value = '';
        },
        (error) => {
          this.snackBar.open(error, null, {
                duration: 8000,
                panelClass: ['bg-danger', 'snackbar']
          });
          this.isUploading = false;
          SharedService.showLoader.next(false);
          this.fileSelector.nativeElement.value = '';
      });
  }

  initCropper(): void {

    this.cropper = new Cropper(this.imageSelector.nativeElement, {
        aspectRatio: 191 / 212,
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
      (photo) => {
        SharedService.showLoader.next(false);
        this.complete.emit(photo);
        this.isCroppingView = false;
        this.cropper.destroy();
        this.snackBar.open('Photo uploaded successfully', null, {
                duration: 8000,
                panelClass: ['bg-success', 'snackbar']
        });
      },
      (error) => {
        SharedService.showLoader.next(false);
        this.snackBar.open(error, null, {
                duration: 8000,
                panelClass: ['bg-danger', 'snackbar']
        });
      }
    );
  }




}


