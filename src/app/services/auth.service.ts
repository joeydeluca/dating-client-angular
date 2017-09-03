import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {AuthDto} from "../models/AuthDto";
import {Profile} from "../models/Profile";
import {AuthContext} from "../models/AuthContext";

@Injectable()
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private headers: Headers;
  private authContext: AuthContext;
  private LOCAL_STORAGE_KEY:string = "authContext";

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  login(email: string, password: string): Observable<AuthContext> {
    const authDto: AuthDto = {email: email, password: password};

    return this.http
      .post(`${this.apiUrl}`, JSON.stringify(authDto), {headers: this.headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.saveAuthContextToLocal(body);
        return body;
      })
      .catch(this.handleError);
  }

  logout(): void {
    this.authContext = null;
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  getAuthContext(): AuthContext {
    return this.getAuthContextFromLocal();
  }

  saveAuthContextToLocal(authContext: AuthContext):void {
    this.authContext = authContext;
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(authContext));
  }

  getAuthContextFromLocal(): AuthContext {
    if(!!this.authContext) {
      return this.authContext;
    }
    return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));
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
    if(res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
