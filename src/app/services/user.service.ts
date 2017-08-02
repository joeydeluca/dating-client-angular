import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Profile} from "../models/Profile";
import {AuthService} from "./auth.service";
import {AuthContext} from "../models/AuthContext";

@Injectable()
export class UserService {
  private apiUrl = environment.apiUrl + '/users';
  headers: Headers;
  user: User;

  constructor(private http: Http, private authService: AuthService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  createUser(user: User): Observable<AuthContext> {
    return this.http
      .post(`${this.apiUrl}`, JSON.stringify(user), {headers: this.headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.authService.saveAuthContextToLocal(body);
        return body;
      })
      .catch(this.handleError);
  }

  updateProfile(profile: Profile, captcha: string): Observable<Profile> {
    const authContext = this.authService.getAuthContextFromLocal();
    const putHeaders = this.headers;
    putHeaders.set("captcha", captcha);
    putHeaders.set("authorization", authContext.token);

    return this.http
      .put(`${this.apiUrl}/${authContext.userId}/profile`, JSON.stringify(profile), {headers: this.headers})
      .map(this.extractData)
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
    let error;
    if(res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
