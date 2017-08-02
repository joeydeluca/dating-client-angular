import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {LocationService} from "../services/location.service";
import {Country, Region, City} from "../models/Location";
import {ProfileFieldService} from "../services/profile-field.service";
import {IMultiSelectOption} from "angular-2-dropdown-multiselect";
import {Profile} from "../models/Profile";
import {RecaptchaComponent} from "ng-recaptcha";
import {IMyDpOptions} from "mydatepicker";
import {DatepickerConfig} from "../common/datepicker.config";
import {Router} from "@angular/router";

@Component({
  selector: 'join-completion',
  templateUrl: './join-completion.component.html',
  styleUrls: ['./join-completion.component.css']
})
export class JoinCompletionComponent implements OnInit {
  @ViewChild(RecaptchaComponent) reCaptchaRef: RecaptchaComponent;
  joinForm: any;
  genders = ["Man", "Woman"];
  submitting: boolean;
  showLoader: boolean;
  countries: Country[];
  regions: Region[];
  cities: City[];
  fieldOptions: object;
  captchaResponse: string;
  myDatePickerOptions: IMyDpOptions = DatepickerConfig.config;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private locationService: LocationService,
              private snackBar: MdSnackBar,
              private fieldsService: ProfileFieldService,
              private router: Router) {
    this.joinForm = this.fb.group({
      'birthday': [{date: {year: new Date().getFullYear() - 18, month: 1, day: 1}}, [Validators.required, ValidationService.birthdayValidator]],
      'country': ['', [Validators.required]],
      'region': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'ethnicity': [[], [Validators.required]],
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

  loadRegions(country: Country) {
    if(!country.countryId) {
      return;
    }

    this.showLoader = true;
    this.locationService.getRegions(country.countryId)
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

  loadCities(region: Region) {
    if(!region.regionId) {
      return;
    }

    this.showLoader = true;
    this.locationService.getCities(region.regionId)
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

  captchaSubmitted(captcha: string) {
    this.captchaResponse = captcha;
  }

  onSubmit() {
    if (this.joinForm.dirty && this.joinForm.valid) {
      this.showLoader = true;
      let profile: Profile = this.joinForm.value;
      this.userService.updateProfile(profile, this.captchaResponse)
        .subscribe(
        (result) => {
          this.submitting = false;
          this.showLoader = false;
          this.router.navigate(['/join-upload-photo']);
        },
        (error) => {
          this.submitting = false;
          this.showLoader = false;
          this.reCaptchaRef.reset();
          this.snackBar.open(error, null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
    }
  }
}
