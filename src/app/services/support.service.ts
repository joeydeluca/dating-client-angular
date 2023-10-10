import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Contact} from '../models/Contact';
import {AuthService} from './auth.service';

@Injectable()
export class SupportService {
  private apiUrl = environment.apiUrl + '/support';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  contact(contact: Contact): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/contact`, contact, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  sendPasswordResetLink(email: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/password-reset`, email, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  resetPassword(requestId: string, password: string): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/password-reset`, {requestId: requestId, password: password}, {headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }

  private getHeaders(): HttpHeaders {
    const authContext = this.authService.getAuthContextFromLocal()
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });

    if (authContext) {
      headers.set("authorization", this.authService.getAuthContextFromLocal().token);
    }

    return headers;  
  }


  private handleError(res: any) {
    let error = res.error;
    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }
}
