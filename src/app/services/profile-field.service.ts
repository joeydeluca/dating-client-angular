import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable()
export class ProfileFieldService {
  private apiUrl = environment.apiUrl + '/fields';
  headers: HttpHeaders;
  fields: object;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  getProfileFields(): Observable<object> {
    if (this.fields) {
      return of(this.fields);
    }

    const fieldsInLocalStorage = localStorage.getItem('fields');
    if (!!fieldsInLocalStorage) {
      return of(JSON.parse(fieldsInLocalStorage));
    }

    return this.http
      .get(`${this.apiUrl}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

   extractData(res: any) {
    let body: any;

    if (res.text()) {
      body = res.json();

      // save to storage
      this.fields = body;
      localStorage.setItem('fields', JSON.stringify(body));
    }

    return body || {};
  }

  private handleError(res: any) {
    let error;
    if (res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

}
