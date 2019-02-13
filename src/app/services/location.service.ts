import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Http, Response, Headers} from '@angular/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {User} from '../models/User';
import {Country, Region, City} from '../models/Location';

@Injectable()
export class LocationService {
  private apiUrl = environment.apiUrl + '/location';
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  getCountries(): Observable<Country[]> {
    return this.http
      .get(`${this.apiUrl}/countries`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getRegions(countryId: string): Observable<Region[]> {
    return this.http
      .get(`${this.apiUrl}/regions?countryId=${countryId}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getCities(regionId: string): Observable<City[]> {
    return this.http
      .get(`${this.apiUrl}/cities?regionId=${regionId}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
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
    if (res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

}
