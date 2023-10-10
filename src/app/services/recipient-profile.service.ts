import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {RecipientProfile} from '../models/RecipientProfile';
import {Message} from '../models/Message';
import {Favorites} from '../models/Favorites';
import {ProfileEvent} from '../models/ProfileEvent';

@Injectable()
export class RecipientProfileService {
  private apiUrl = environment.apiUrl + '/recipient-profile';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  sendFlirt(recipientUserId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/flirt`, null, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  addFavorite(recipientUserId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/favorite`, null, {headers: this.getHeaders()})
      .pipe(catchError((res) => {
        if (res.status == 304) {
          return throwError('Already added as favorite');
        }
        return this.handleError(res);
      }));
  }

  deleteFavorite(recipientUserId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${recipientUserId}/favorite`, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getRecipientProfile(recipientUserId: number): Observable<RecipientProfile> {
    return this.http
      .get<RecipientProfile>(`${this.apiUrl}/${recipientUserId}`, {headers: this.getHeaders()})
      .pipe(map((res: RecipientProfile) => {
        return res;
      }), catchError(this.handleError));

  }

  reportProfile(recipientUserId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${recipientUserId}/report-profile`, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getMessages(): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${this.apiUrl}/messages`, {headers: this.getHeaders()})
      .pipe(map((res: Message[]) => {
        return res;
      }), catchError(this.handleError));
  }

  sendMessage(recipientUserId: number, message: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${recipientUserId}/message`, message, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));

  }

  markMessagesAsRead(recipientUserId: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${recipientUserId}/message/read`, null, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getFavorites(): Observable<Favorites> {
    return this.http
      .get<Favorites>(`${this.apiUrl}/favorites`, {headers: this.getHeaders()})
      .pipe(map((res: Favorites) => {
        return res;
      }), catchError(this.handleError));
  }

  getFlirts(): Observable<ProfileEvent[]> {
    return this.http
      .get<ProfileEvent[]>(`${this.apiUrl}/flirts`, {headers: this.getHeaders()})
      .pipe(map((res: ProfileEvent[]) => {
        return res;
      }), catchError(this.handleError));
  }

  getProfileViews(): Observable<ProfileEvent[]> {
    return this.http
      .get<ProfileEvent[]>(`${this.apiUrl}/profile-views`, {headers: this.getHeaders()})
      .pipe(map((res: ProfileEvent[]) => {
        return res;
      }), catchError(this.handleError));
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': this.authService.getAuthContextFromLocal().token
    });
  }

  private handleError(res: any) {
    let error = res.error;
    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }
}
