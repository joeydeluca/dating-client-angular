import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Http, Response, Headers} from '@angular/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {Page} from '../models/Page';
import {AuthService} from './auth.service';
import {AuthContext} from '../models/AuthContext';
import {RecipientProfile} from '../models/RecipientProfile';
import {Message} from '../models/Message';
import {Favorites} from '../models/Favorites';
import {ProfileEvent} from '../models/ProfileEvent';

@Injectable()
export class RecipientProfileService {
  private apiUrl = environment.apiUrl + '/recipient-profile';

  constructor(private http: Http, private authService: AuthService) {
  }

  sendFlirt(recipientUserId: number): Observable<Response> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/flirt`, null, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  addFavorite(recipientUserId: number): Observable<Response> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/favorite`, null, {headers: this.getHeaders()})
      .pipe(catchError((res) => {
        if (res.status == 304) {
          return throwError('Already added as favorite');
        }
        return this.handleError(res);
      }));
  }

  deleteFavorite(recipientUserId: number): Observable<Response> {
    return this.http
      .delete(`${this.apiUrl}/${recipientUserId}/favorite`, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getRecipientProfile(recipientUserId: number): Observable<RecipientProfile> {
    return this.http
      .get(`${this.apiUrl}/${recipientUserId}`, {headers: this.getHeaders()})
      .pipe(map((res: Response) => {
        const body = this.extractData(res);
        return body;
      }), catchError(this.handleError));

  }

  reportProfile(recipientUserId: number): Observable<Response> {
    return this.http
      .get(`${this.apiUrl}/${recipientUserId}/report-profile`, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getMessages(): Observable<Message[]> {
    return this.http
      .get(`${this.apiUrl}/messages`, {headers: this.getHeaders()})
      .pipe(map((res: Response) => {
        const body = this.extractData(res);
        return body;
      }), catchError(this.handleError));
  }

  sendMessage(recipientUserId: number, message: string): Observable<Response> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/message`, message, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));

  }

  markMessagesAsRead(recipientUserId: number): Observable<Response> {
    return this.http
      .put(`${this.apiUrl}/${recipientUserId}/message/read`, null, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getFavorites(): Observable<Favorites> {
    return this.http
      .get(`${this.apiUrl}/favorites`, {headers: this.getHeaders()})
      .pipe(map((res: Response) => {
        const body = this.extractData(res);
        return body;
      }), catchError(this.handleError));
  }

  getFlirts(): Observable<ProfileEvent[]> {
    return this.http
      .get(`${this.apiUrl}/flirts`, {headers: this.getHeaders()})
      .pipe(map((res: Response) => {
        const body = this.extractData(res);
        return body;
      }), catchError(this.handleError));
  }

  getProfileViews(): Observable<ProfileEvent[]> {
    return this.http
      .get(`${this.apiUrl}/profile-views`, {headers: this.getHeaders()})
      .pipe(map((res: Response) => {
        const body = this.extractData(res);
        return body;
      }), catchError(this.handleError));
  }

  private getHeaders(): Headers {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set('authorization', authContext.token);
    headers.set('Content-Type', 'application/json');
    return headers;
  }

  private extractData(res: Response) {
    let body;
    if (res.text()) {
      body = res.json();
    }
    return body || {};
  }

  private handleError(res: Response | any) {
    let error;
    if (res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }
}
