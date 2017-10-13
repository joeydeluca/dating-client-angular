import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {SharedService} from "../services/shared.service";
import {Subscription} from "../models/Subscription";
import {PaymentService} from "../services/payment.service";
import {PaymentPageData} from "../models/PaymentPageData";
import {User} from "../models/User";


@Component({
  selector: 'settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    accountStatus: string;
    subscription: Subscription;
    paymentPageData: PaymentPageData;
    isSubscriptionExpired: boolean;
    user: User = new User();

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private paymentService: PaymentService,
        private snackBar: MdSnackBar,
        private router: Router) {
    }

    ngOnInit() {
        SharedService.showLoader.next(true);
        this.accountStatus = this.authService.getAuthContext().paid ? "UPGRADED" : "BASIC";

        this.userService.getUser().subscribe(
            (user) => {
                this.user = user;
            }, 
            (error) => {
                this.showError(error);
            },
            () => SharedService.showLoader.next(false)
        );

        this.userService.getSubscription().subscribe(
            (subscription) => {
                this.subscription = subscription;
                this.isSubscriptionExpired = new Date(subscription.endDate) < new Date();
            }, 
            (error) => {},
            () => SharedService.showLoader.next(false)
        );

        this.paymentService.getPaymentPageData()
        .subscribe(
            (result) => this.paymentPageData = result
        );
    }

    logout(): void {
        this.authService.logout();
        this.userService.clearCache();
        this.snackBar.open('You have logged out', null, { duration: 4000, extraClasses: ['bg-success', 'snackbar'] });
        this.router.navigate(['/login']);
    }

    onSubmit(): void {
        SharedService.showLoader.next(true);
        this.userService.updateEmailSubscription(this.user.emailSubscription).subscribe(
            () => {this.showSuccess('Done');SharedService.showLoader.next(false);},
            () => {this.showError('Request failed');SharedService.showLoader.next(false);} 
        );
    }

    deleteAccount(): void {
        SharedService.showLoader.next(true);
        this.userService.deleteAccount().subscribe(
            () => {
                let message = "Your account has been deleted. We are sorry to see you go. ";
                if(this.subscription && !this.isSubscriptionExpired) {
                    message += "If you have a PayPal subscription, please cancel through PayPal.com."; 
                }
                this.showSuccess(message);
                SharedService.showLoader.next(false);
                this.authService.logout();
                this.router.navigate(['/']);
            },
            () => {this.showError('Request failed');SharedService.showLoader.next(false);} 
        );
    }

    private showError(message: string) {
        this.snackBar.open(message, null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
        });
    }

    private showSuccess(message: string) {
        this.snackBar.open(message, null, {
            duration: 4000,
            extraClasses: ['bg-success', 'snackbar']
        });
    }

}