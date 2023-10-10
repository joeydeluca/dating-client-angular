import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {User, EmailSubscription} from '../models/User';
import {Profile} from '../models/Profile';
import {Page} from '../models/Page';
import {AuthService} from './auth.service';
import {AuthContext} from '../models/AuthContext';
import {RecipientProfile} from '../models/RecipientProfile';
import {Subscription} from '../models/Subscription';

@Injectable()
export class UserService {
  private apiUrl = environment.apiUrl + '/users';
  headers: HttpHeaders;
  user: User;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  createUser(user: User): Observable<AuthContext> {
    return this.http
      .post<AuthContext>(`${this.apiUrl}`, JSON.stringify(user), {headers: this.headers})
      .pipe(map((body: AuthContext) => {
        this.authService.saveAuthContextToLocal(body);
        return body;
      }), catchError(this.handleError));
  }

  completeUserJoin(user: User, captcha: string): Observable<User> {
    const authContext = this.authService.getAuthContextFromLocal();

    console.log(captcha);

    return this.http
      .put<User>(`${this.apiUrl}/${authContext.userId}/join-completion`, JSON.stringify(user), {headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': authContext.token,
        'captcha':  captcha || ''
      })})
      .pipe(map((body: User) => {
        this.saveToLocal(body);
        return body;
      }), catchError(this.handleError));
  }

  updateProfile(profile: Profile): Observable<User> {
    const authContext = this.authService.getAuthContextFromLocal();

    return this.http
      .put<User>(`${this.apiUrl}/${authContext.userId}/profile`, JSON.stringify(profile), {headers: this.getHeaders()})
      .pipe(map((body: any) => {
        this.saveToLocal(body);
        return body;
      }), catchError(this.handleError));
  }

  updateEmailSubscription(emailSubscription: EmailSubscription): Observable<User> {
    const authContext = this.authService.getAuthContextFromLocal();

    return this.http
      .put<User>(`${this.apiUrl}/${authContext.userId}/email-subscription`, JSON.stringify(emailSubscription), {headers: this.getHeaders()})
      .pipe(map((body: any) => {
        this.saveToLocal(body);
        return body;
      }), catchError(this.handleError));
  }

  getUser(): Observable<User> {
    if (!!this.user) {
      return of(this.user);
    }

    const profileInLocalStorage = localStorage.getItem('user');
    if (!!profileInLocalStorage) {
      return of(JSON.parse(profileInLocalStorage));
    }

    return this.getUserFromServer();
  }

  getUserFromServer(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${this.authService.getAuthContextFromLocal().userId}`, {headers: this.getHeaders()})
      .pipe(map((res: User) => {
        this.saveToLocal(res);
        return res;
      }), catchError(this.handleError));
  }

  searchProfiles(pageNumber: number, ageFrom: number, ageTo: number, countryId: string, regionId: string = '', cityId: string = ''): Observable<any> {
    return this.http
      .get<Page<RecipientProfile>>(`${this.apiUrl}/profiles?page=${pageNumber}&age-from=${ageFrom}&age-to=${ageTo}&country=${countryId}&region=${regionId}&city=${cityId}`, {headers: this.getHeaders()})
      .pipe(map((res: Page<RecipientProfile>) => {
        return res;
      }), catchError(this.handleError));
  }

  isPaid(): Observable<boolean> {
    return this.http
      .get(`${this.apiUrl}/payment-status`, {headers: this.getHeaders(), responseType: 'text'})
      .pipe(map((res: any) => {
        return res === 'PAID';
      }), catchError(this.handleError));
  }

  deleteAccount(): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${this.authService.getAuthContextFromLocal().userId}`, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  getSubscription(): Observable<Subscription> {
    return this.http
      .get<Subscription>(`${this.apiUrl}/subscription`, {headers: this.getHeaders()})
      .pipe(map((body: any) => {
        return body;
      }), catchError(this.handleError));
  }

  clearCache(): void {
    this.user = null;
    localStorage.removeItem('user');
  }

  private handleError(error: any) {
    error = error.error;
    const errMsg = (error && error?.message) ? error.message :
      (error && error?.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

  private saveToLocal(user: User): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': this.authService.getAuthContextFromLocal().token
    });
  }
}
