import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {AuthDto} from '../models/AuthDto';
import {AuthContext} from '../models/AuthContext';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private headers: HttpHeaders;
  private authContext: AuthContext;
  private LOCAL_STORAGE_KEY = 'authContext';
  private jwthelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  getFrendToken(): Observable<String> {
    return this.http
      .get(`${this.apiUrl}/chat/init`, {headers: this.getHeaders(), responseType: 'text'});
  }

  login(email: string, password: string): Observable<AuthContext> {
    const authDto: AuthDto = {email: email, password: password};

    return this.http
      .post<AuthContext>(`${this.apiUrl}`, JSON.stringify(authDto), {headers: this.headers})
      .pipe(map((res: AuthContext) => {
        this.saveAuthContextToLocal(res);
        return res;
      }), catchError(this.handleError));
  }

  logout(): void {
    this.authContext = null;
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  getAuthContext(): AuthContext {
    const auth = this.getAuthContextFromLocal();
    if(auth) {
      try {
        if (this.jwthelper.isTokenExpired(auth.token)) {
          return null;
        }
      } catch(e) {
        console.error(e);
      }
    }

    return auth;
  }

  saveAuthContextToLocal(authContext: AuthContext): void {
    this.authContext = authContext;
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(authContext));
  }

  getAuthContextFromLocal(): AuthContext {
    
    if (!!this.authContext) {
      return this.authContext;
    }
    return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));
  }

  refreshContext(): Observable<AuthContext> {
    return this.http
      .post<AuthContext>(`${this.apiUrl}/refresh`, null, {headers: this.getHeaders()})
      .pipe(map((body: AuthContext) => {
        this.saveAuthContextToLocal(body);
        return body;
      }), catchError(this.handleError));
  }

  private handleError(error: any) {
    error = error.error;
    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': this.getAuthContextFromLocal().token
    });
  }

}
