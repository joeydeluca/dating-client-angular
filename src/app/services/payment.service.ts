import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable, throwError} from "rxjs";
import {map, catchError} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {PaymentPageData} from "../models/PaymentPageData";

@Injectable()
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payment';

  constructor(private http: Http, private authService: AuthService) {
  }

  getPaymentPageData(): Observable<PaymentPageData> {
    return this.http
      .get(`${this.apiUrl}/request`, {headers: this.getHeaders()})
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
    if(res.text()) {
      error = res.json();
    }

    const errMsg = (error && error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }

  private getHeaders(): Headers {
    const authContext = this.authService.getAuthContextFromLocal();
    const headers = new Headers();
    headers.set("authorization", authContext.token);
    headers.set('Content-Type', 'application/json');
    return headers;
  }

}
