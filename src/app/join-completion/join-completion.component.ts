import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {MatSnackBar} from "@angular/material";
import {LocationService} from "../services/location.service";
import {Country, Region, City} from "../models/Location";
import {ProfileFieldService} from "../services/profile-field.service";
import {IMultiSelectOption} from "angular-2-dropdown-multiselect";
import {Profile} from "../models/Profile";
import {RecaptchaComponent} from "ng-recaptcha";
import {IMyDpOptions, MyDatePicker} from "mydatepicker";
import {DatepickerConfig} from "../common/datepicker.config";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared.service";

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
  countries: Country[];
  regions: Region[];
  cities: City[];
  fieldOptions: object;
  captchaResponse: string;
  myDatePickerOptions: IMyDpOptions = DatepickerConfig.config;
  @ViewChild('mydp') mydp: MyDatePicker;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private locationService: LocationService,
              private snackBar: MatSnackBar,
              private fieldsService: ProfileFieldService,
              private router: Router) {
    this.joinForm = this.fb.group({
      'birthday': [{date: `${new Date().getFullYear() - 18}-01-01`}, [Validators.required]],
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
          SharedService.showLoader.next(false);
        },
        (error) => {
          SharedService.showLoader.next(false);
          this.snackBar.open('Error loading fields', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );

  }

  loadCountries() {
    SharedService.showLoader.next(true);
    this.locationService.getCountries()
      .subscribe(
        (result) => {
          this.countries = result;
          this.countries.unshift(this.countries.find(c => c.countryName === 'Canada'));
          this.countries.unshift(this.countries.find(c => c.countryName === 'United States'));
          this.joinForm.patchValue({ country: this.countries[0] });
          SharedService.showLoader.next(false);
        },
        (error) => {
          SharedService.showLoader.next(false);
          this.snackBar.open('Error fetching Country list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadRegions(country: Country) {
    if(!country.countryId) {
      return;
    }

    SharedService.showLoader.next(true);
    this.locationService.getRegions(country.countryId)
      .subscribe(
        (result) => {
          this.regions = result;
          SharedService.showLoader.next(false);
        },
        (error) => {
          SharedService.showLoader.next(false);
          this.snackBar.open('Error fetching Region list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadCities(region: Region) {
    if(!region.regionId) {
      return;
    }

   SharedService.showLoader.next(true);
    this.locationService.getCities(region.regionId)
      .subscribe(
        (result) => {
          this.cities = result;
          SharedService.showLoader.next(false);
        },
        (error) => {
          SharedService.showLoader.next(false);
          this.snackBar.open('Error fetching City list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  captchaSubmitted(captcha: string) {
    this.captchaResponse = captcha;
  }

  onSubmit() {
    if (this.joinForm.dirty && this.joinForm.valid) {
      SharedService.showLoader.next(true);
      const user = new User();
      const profile = this.joinForm.value;
      user.profile = profile;
      user.birthDate = new Date(this.mydp.getDateModel(this.mydp.selectedDate).jsdate).toISOString().slice(0,10);

      this.userService.completeUserJoin(user, this.captchaResponse)
        .subscribe(
        (result) => {
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.router.navigate(['/join-upload-photo']);
        },
        (error) => {
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.reCaptchaRef.reset();
          this.snackBar.open(error, null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
    }
  }
}
