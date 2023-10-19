import {Component, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../services/shared.service';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
import {PaymentService} from '../services/payment.service';
import {PaymentPageData} from '../models/PaymentPageData';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'frend-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class FrendUpgradeComponent implements OnInit {
    paymentPageData: PaymentPageData;
    userId: number;
    features: string[] = ['Chat with AI Companion', 'UNLIMITED USE'];

    constructor(
        private authService: AuthService,
        private paymentService: PaymentService,
        private snackBar: MatSnackBar) {
        this.userId = this.authService.getAuthContext().userId;
    }

    ngOnInit() {
        SharedService.showLoader.next(true);
        this.paymentService.getPaymentPageData()
        .subscribe(
            (result) => {
                result.productPrices.sort((a, b) => {
                    if (a.positionWeight < b.positionWeight) { return 1; } else if (a.positionWeight > b.positionWeight) { return -1; } else { return 0; }
                });
                this.paymentPageData = result;
                SharedService.showLoader.next(false);
            },
            (error) => {
                SharedService.showLoader.next(false);
                console.log(error);
                this.snackBar.open('Error loading payment data', null, {
                    duration: 4000,
                    panelClass: ['bg-danger', 'snackbar']
            });
            }
        );
    }
}
