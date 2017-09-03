import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ProfileFieldService {
  private apiUrl = environment.apiUrl + '/fields';
  headers: Headers;
  fields: object;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  getProfileFields(): Observable<object> {
    if(this.fields) {
      return Observable.of(this.fields);
    }

    const fieldsInLocalStorage = localStorage.getItem("fields");
    if(!!fieldsInLocalStorage) {
      return Observable.of(JSON.parse(fieldsInLocalStorage));
    }

    return this.http
      .get(`${this.apiUrl}`, {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

   extractData(res: Response) {
    let body: any;
    
    if (res.text()) {
      body = res.json();
      
      // save to storage
      this.fields = body;
      localStorage.setItem("fields", JSON.stringify(body));
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
