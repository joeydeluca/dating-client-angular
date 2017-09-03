import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Profile} from "../models/Profile";
import {Page} from "../models/Page";
import {AuthService} from "./auth.service";
import {AuthContext} from "../models/AuthContext";
import {RecipientProfile} from "../models/RecipientProfile";

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

  completeUserJoin(user: User, captcha: string): Observable<User> {
    const authContext = this.authService.getAuthContextFromLocal();
    const putHeaders = this.headers;
    putHeaders.set("captcha", captcha);
    putHeaders.set("authorization", authContext.token);

    return this.http
      .put(`${this.apiUrl}/${authContext.userId}/join-completion`, JSON.stringify(user), {headers: this.headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.saveToLocal(body);
        return body;
      })
      .catch(this.handleError);
  }

  updateProfile(profile: Profile): Observable<User> {
    const authContext = this.authService.getAuthContextFromLocal();
    const putHeaders = this.headers;
    putHeaders.set("authorization", authContext.token);

    return this.http
      .put(`${this.apiUrl}/${authContext.userId}/profile`, JSON.stringify(profile), {headers: this.headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.saveToLocal(body);
        return body;
      })
      .catch(this.handleError);
  }

  getUser(): Observable<User> {
    if(!!this.user) {
      return Observable.of(this.user);
    }
    
    const profileInLocalStorage = localStorage.getItem("user");
    if(!!profileInLocalStorage) {
      return Observable.of(JSON.parse(profileInLocalStorage));
    }

    return this.getUserFromServer();
  }

  getUserFromServer(): Observable<User> {
    return this.http
      .get(`${this.apiUrl}/${this.authService.getAuthContextFromLocal().userId}`, {headers: this.getHeaders()})
      .map((res: Response) => {
        let body = this.extractData(res);
        this.saveToLocal(body);
        return body;
      })
      .catch(this.handleError);
  }

  searchProfiles(pageNumber: number, ageFrom: number, ageTo: number, countryId: string, regionId: string = "", cityId: string = ""): Observable<Page<RecipientProfile>> {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    headers.set('Content-Type', 'application/json');
    
    return this.http
      .get(`${this.apiUrl}/profiles?page=${pageNumber}&age-from=${ageFrom}&age-to=${ageTo}&country=${countryId}&region=${regionId}&city=${cityId}`, {headers: headers})
      .map((res: Response) => {
        let body = this.extractData(res);
        // cache here
        return body;
      })
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

  private saveToLocal(user: User):void {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  private getHeaders(): Headers {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    headers.set('Content-Type', 'application/json');
    return headers;
  }

}
