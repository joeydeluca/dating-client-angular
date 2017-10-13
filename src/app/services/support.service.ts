import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Contact} from "../models/Contact";
import {AuthService} from "./auth.service";
import {AuthContext} from "../models/AuthContext";

@Injectable()
export class SupportService {
  private apiUrl = environment.apiUrl + '/support';

  constructor(private http: Http, private authService: AuthService) {
  }

  contact(contact: Contact): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/contact`, contact, {headers: this.getHeaders()})
      .catch(this.handleError);
  }
  
  private getHeaders(): Headers {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    if(authContext) {
      headers.set("authorization", authContext.token);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
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
