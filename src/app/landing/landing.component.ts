import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  user = new User();

  joinForm: any;

  genders = ["Man", "Woman"];

  constructor(private fb: FormBuilder) {
    this.joinForm = this.fb.group({
      'gender': ['', [Validators.required]],
      'genderSeeking': ['', [Validators.required]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'username': ['', [Validators.required, Validators.maxLength(12)]],
      'password': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    });
  }

  ngOnInit(): void {
    //this.joinForm.buildForm();

  }

  onSubmit() {
    /*if(!this.joinForm.isValid()) {
      return;
    }*/

    if (this.joinForm.dirty && this.joinForm.valid) {
      alert(`email: ${this.joinForm.value.email} `);
    }

    this.user = this.joinForm.value;

  }
}
