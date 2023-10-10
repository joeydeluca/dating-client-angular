import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {Country, Region, City} from '../models/Location';

@Injectable()
export class LocationService {
  private apiUrl = environment.apiUrl + '/location';
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  getCountries(): Observable<Country[]> {
    return this.http
      .get<Country[]>(`${this.apiUrl}/countries`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getRegions(countryId: string): Observable<Region[]> {
    return this.http
      .get<Region[]>(`${this.apiUrl}/regions?countryId=${countryId}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getCities(regionId: string): Observable<City[]> {
    return this.http
      .get<City[]>(`${this.apiUrl}/cities?regionId=${regionId}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getCurrentLocation(latitide: number, longitude: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/findme?latitude=${latitide}&longitude=${longitude}`, {headers: this.headers})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  private extractData(res: any) {
    return res;
  }

  private handleError(res: any) {
    let error = res.error;
    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

}
