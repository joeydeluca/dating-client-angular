import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {PaymentPageData} from '../models/PaymentPageData';

@Injectable()
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payment';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getPaymentPageData(): Observable<PaymentPageData> {
    return this.http
      .get(`${this.apiUrl}/request`, {headers: this.getHeaders()})
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  private extractData(res: any) {
    return res || {}
  }

  private handleError(res: any) {
    let error = res || {};

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': this.authService.getAuthContextFromLocal().token
    });
  }

}
