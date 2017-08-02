import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Profile} from "../models/Profile";
import {AuthContext} from "../models/AuthContext";

@Injectable()
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth-context';
  headers: Headers;
  authContext: AuthContext;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

/*  login(user: User): Observable<User> {
    return this.http
      .post(`${this.apiUrl}`, JSON.stringify(user), {headers: this.headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.user = body;
        return body;
      })
      .catch(this.handleError);
  }*/

  saveAuthContextToLocal(authContext: AuthContext):void {
    this.authContext = authContext;
    localStorage.setItem("authContext", JSON.stringify(authContext));
  }

  getAuthContextFromLocal(): AuthContext {
    if(!!this.authContext) {
      return this.authContext;
    }
    return JSON.parse(localStorage.getItem("authContext"));
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
