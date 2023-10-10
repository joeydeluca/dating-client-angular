import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {Photo} from '../models/Photo';
import {PhotoCrop} from '../models/PhotoCrop';
import {AuthService} from './auth.service';
import {AuthContext} from '../models/AuthContext';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class PhotoService {
  private apiUrl = environment.apiUrl + '/photos';
  user: User;

  supportedMimeTypes: Array<string> = ['image/jpeg', 'image/png'];
  maxFileSizeMB = 15;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar) {
  }

  uploadPhoto(file: File): Observable<Photo> {
    if (!file) {
      return throwError('No file selected');
    } else if (this.supportedMimeTypes.indexOf(file.type) === -1) {
      return throwError(`File must be one of the supported formats: ${this.supportedMimeTypes.join(', ')}`);
    } else if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      return throwError(`File exceeds maximum size of ${this.maxFileSizeMB}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'authorization': this.authService.getAuthContextFromLocal().token
    });

    return this.http
      .post(`${this.apiUrl}`, formData, {headers: headers})
      .pipe(map(this.extractData), catchError((this.handleError)));
  }

  setProfilePhoto(photoId: number): Observable<Photo> {
    return this.http
          .put<Photo>(`${this.apiUrl}/${photoId}/profile`, null, {headers: this.getHeaders()})
          .pipe(map(this.extractData), catchError((this.handleError)));

  }

    deletePhoto(photoId: number): Observable<void> {
      return this.http
          .delete(`${this.apiUrl}/${photoId}`, {headers: this.getHeaders()})
          .pipe(map(this.extractData), catchError((this.handleError)));
  }

  cropPhoto(photoId: number, x: number, y: number, width: number, height: number): Observable<Photo> {
    const photoCrop = new PhotoCrop();
    photoCrop.x = x;
    photoCrop.y = y;
    photoCrop.width = width;
    photoCrop.height = height;

    return this.http
      .put(`${this.apiUrl}/${photoId}/crop`, JSON.stringify(photoCrop), {headers: this.getHeaders()})
      .pipe(map(this.extractData), catchError((this.handleError)));

  }

  private extractData(res: any) {
    return res;
  }

  private handleError(error: any) {
    if (error?.status === 413) {
      return throwError('File is too large');
    }

    if(error.error) {
      error = error.error;
        }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return throwError(errMsg);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': this.authService.getAuthContextFromLocal().token
    });
  }

}
