import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {SupportService} from "../services/support.service";
import {Contact} from "../models/Contact";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material";


@Component({
  selector: 'support',
  templateUrl: './support.component.html'
})
export class SupportComponent {
    isAuthenticated: boolean = false;

    form: any;

    isSubmiting: boolean;

    constructor(private supportService: SupportService, private authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar) {
        this.isAuthenticated = !!this.authService.getAuthContext();

        this.form = this.fb.group({
            'name': ['', [Validators.required, Validators.maxLength(1000)]],
            'email': ['', [Validators.required, Validators.maxLength(1000)]],
            'message': ['', [Validators.required, Validators.maxLength(1000)]],
        });
    }

    onSubmit(): void {
        this.isSubmiting = true;
        
        const contact: Contact = {
            name: this.form.value.name,
            email: this.form.value.email,
            message: this.form.value.message
        };

        this.supportService.contact(contact).subscribe();

         this.showSuccess("Message Sent");
         this.form.reset();
         this.isSubmiting = false;
    }

    private showError(message: string) {
        this.snackBar.open(message, null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
        });
    }

    private showSuccess(message: string) {
        this.snackBar.open(message, null, {
            duration: 4000,
            panelClass: ['bg-success', 'snackbar']
        });
    }
}