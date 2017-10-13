import {Component, OnInit, ViewChild} from "@angular/core";
import {SharedService} from "../services/shared.service";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
import {PaymentService} from "../services/payment.service";
import {UserService} from "../services/user.service";
import {User} from "../models/User";
import {MdSnackBar} from "@angular/material";
import {Observable} from "rxjs";


@Component({
  selector: 'verify-payment',
  templateUrl: './verify-payment.component.html'
})
export class VerifyPaymentComponent implements OnInit {
    state: "verify" | "verify-fail" | "verify-pass" = "verify";
    poll: boolean = true;
    pollCount: number = 0;
    maxPollCount: number = 20;

    constructor(
        private authService: AuthService, 
        private userService: UserService,
        private snackBar: MdSnackBar) {
    }

    ngOnInit() {
        SharedService.showLoader.next(true);

        Observable.interval(3000)
        .mergeMap(() => this.userService.isPaid())
        .takeWhile(() => this.poll)
        .subscribe(
            (isPaid: boolean) => {
                this.pollCount++;
                if(isPaid) {
                    SharedService.showLoader.next(false);
                    this.state = "verify-pass";
                    this.poll = false;
                    
                    this.authService.refreshContext().subscribe();
                    this.userService.getUserFromServer().subscribe();
                    SharedService.showUpgradeButton.next(false);
                }
                else if(this.pollCount >= this.maxPollCount) {
                    SharedService.showLoader.next(false);
                    this.state = "verify-fail";
                    this.poll = false;
                }
            },
            () => {
                this.pollCount++;
                SharedService.showLoader.next(false);
                this.state = "verify-fail";
                this.poll = false;
                this.snackBar.open('An error has occured.', null, {
                    duration: 4000,
                    extraClasses: ['bg-danger', 'snackbar']
                })
            });
            
    }
}