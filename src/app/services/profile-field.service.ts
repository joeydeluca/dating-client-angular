import {ComponentFactoryResolver, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable()
export class ProfileFieldService {
  private apiUrl = environment.apiUrl + '/fields';
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  getProfileFields(): Observable<object> {

    const fieldsInLocalStorage = localStorage.getItem('fields');
    if (!!fieldsInLocalStorage) {
      return of(JSON.parse(fieldsInLocalStorage));
    }

    return this.http
      .get(`${this.apiUrl}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

   extractData(res: any) {
    let body = res;

    // save to storage
    localStorage.setItem('fields', JSON.stringify(body));

    return body || {};
  }

  private handleError(error: any) {
    console.error(error);
    error = error.error;
    const errMsg = (error && error?.message) ? error.message :
      (error && error?.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }


}
