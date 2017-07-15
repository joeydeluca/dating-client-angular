import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {LocationService} from "../services/location.service";
import {Country, Region, City} from "../models/Location";
import {ProfileFieldService} from "../services/profile-field.service";

@Component({
  selector: 'join-completion',
  templateUrl: './join-completion.component.html',
  styleUrls: ['./join-completion.component.css']
})
export class JoinCompletionComponent implements OnInit {
  user = new User();
  joinForm: any;
  genders = ["Man", "Woman"];
  submitting: boolean;
  showLoader: boolean;
  countries: Country[];
  regions: Region[];
  cities: City[];
  fieldOptions: object;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private locationService: LocationService,
              private snackBar: MdSnackBar,
              private fieldsService: ProfileFieldService) {
    this.joinForm = this.fb.group({
      'birthday': ['', [Validators.required, ValidationService.birthdayValidator]],
      'country': ['', [Validators.required]],
      'region': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'ethnicity': ['', [Validators.required]],
      'bodyType': ['', [Validators.required]],
      'smoke': ['', [Validators.required]],
      'childrenStatus': ['', [Validators.required]],
      'aboutMe': ['', [Validators.maxLength(4000)]],
      'agreeToTerms': ['1', [ValidationService.checkboxValidator]]
    });

  }

  ngOnInit(): void {
    this.loadCountries();
    this.fieldsService.getProfileFields()
      .subscribe(
        (result) => {
          this.fieldOptions = result;
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
          this.snackBar.open('Error loading fields', null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadCountries() {
    this.showLoader = true;
    this.locationService.getCountries()
      .subscribe(
        (result) => {
          this.countries = result;
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
          this.snackBar.open('Error fetching Country list', null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadRegions(countryId) {
    if(!countryId) {
      return;
    }

    this.showLoader = true;
    this.locationService.getRegions(countryId)
      .subscribe(
        (result) => {
          this.regions = result;
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
          this.snackBar.open('Error fetching Region list', null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadCities(regionId) {
    if(!regionId) {
      return;
    }

    this.showLoader = true;
    this.locationService.getCities(regionId)
      .subscribe(
        (result) => {
          this.cities = result;
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
          this.snackBar.open('Error fetching City list', null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  onSubmit() {
    if (this.joinForm.dirty && this.joinForm.valid) {
      this.showLoader = true;
      this.user = this.joinForm.value;
      this.userService.createUser(this.user)
        .subscribe(
        (result) => {
          this.submitting = false;
          this.showLoader = false;
          alert('join success');
        },
        (error) => {
          this.submitting = false;
          this.showLoader = false;
          this.snackBar.open(error, null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
    }
  }
}
