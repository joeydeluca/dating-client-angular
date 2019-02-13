import {Component, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../services/shared.service';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth.service';
import {PaymentService} from '../services/payment.service';
import {PaymentPageData} from '../models/PaymentPageData';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
    paymentPageData: PaymentPageData;
    userId: number;
    features: string[] = ['Send messages', 'Read messages', 'Who\'s viewed your profile', 'Rank higher in search results'];

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
                this.snackBar.open('Error loading payment data', null, {
                    duration: 4000,
                    panelClass: ['bg-danger', 'snackbar']
            });
            }
        );
    }
}
