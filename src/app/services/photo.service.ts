import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Profile} from "../models/Profile";
import {Photo} from "../models/Photo";
import {PhotoCrop} from "../models/PhotoCrop";
import {AuthService} from "./auth.service";
import {AuthContext} from "../models/AuthContext";
import {MdSnackBar} from "@angular/material";

@Injectable()
export class PhotoService {
  private apiUrl = environment.apiUrl + '/photos';
  user: User;

  supportedMimeTypes:Array<string> = ['image/jpeg', 'image/png']
  maxFileSizeMB:number = 15;

  constructor(private http: Http, 
    private authService: AuthService, 
    private snackBar: MdSnackBar) {
  }

  uploadPhoto(file: File): Observable<Photo> {
    if(!file) {
      return Observable.throw('No file selected');
    }
    else if(this.supportedMimeTypes.indexOf(file.type) === -1) {
      return Observable.throw(`File must be one of the supported formats: ${this.supportedMimeTypes.join(', ')}`);
    }
    else if(file.size > this.maxFileSizeMB * 1024 * 1024) {
      return Observable.throw(`File exceeds maximum size of ${this.maxFileSizeMB}MB`);
    }

    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    let formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.apiUrl}`, formData, {headers: headers})
      .map(this.extractData)
      .catch((this.handleError));
  }

  setProfilePhoto(photoId: number): Observable<Photo> {
    return this.http
          .put(`${this.apiUrl}/${photoId}/profile`, null, {headers: this.getHeaders()})
          .map(this.extractData)
          .catch((this.handleError));
  }

    deletePhoto(photoId: number): Observable<void> {
      return this.http
          .delete(`${this.apiUrl}/${photoId}`, {headers: this.getHeaders()})
          .map(this.extractData)
          .catch((this.handleError));
  }

  cropPhoto(photoId: number, x: number, y: number, width: number, height: number): Observable<Photo> {
    const photoCrop = new PhotoCrop();
    photoCrop.x = x;
    photoCrop.y = y;
    photoCrop.width = width;
    photoCrop.height = height;

    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    headers.set('Content-Type', 'application/json');

    return this.http
      .put(`${this.apiUrl}/${photoId}/crop`, JSON.stringify(photoCrop), {headers: headers})
      .map((res: Response) => this.extractData(res))
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body;
    if (res.text()) {
      body = res.json();
    }
    return body || {};
  }

  private handleError(res: Response | any) {
    if(res.status === 413) {
      return Observable.throw('File is too large');
    }

    let error;
    if(res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errMsg);
  }

  private getHeaders(): Headers {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    headers.set('Content-Type', 'application/json');
    return headers;
  }

}
