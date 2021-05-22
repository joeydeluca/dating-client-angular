import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {User} from '../models/User';
import {ValidationService} from '../services/validation.service';
import {UserService} from '../services/user.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {LocationService} from '../services/location.service';
import {Country, Region, City} from '../models/Location';
import {ProfileFieldService} from '../services/profile-field.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Profile} from '../models/Profile';
import {RecaptchaComponent} from 'ng-recaptcha';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {Router} from '@angular/router';
import {SharedService} from '../services/shared.service';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'join-completion',
  templateUrl: './join-completion.component.html',
  styleUrls: ['./join-completion.component.css']
})
export class JoinCompletionComponent implements OnInit {
  @ViewChild(RecaptchaComponent) reCaptchaRef: RecaptchaComponent;
  joinForm: any;
  genders = ['Man', 'Woman'];
  submitting: boolean;
  countries: Country[];
  regions: Region[];
  cities: City[];
  defaultCountry: Country;
  defaultRegion: Region;
  defaultCity: City;
  fieldOptions: object;
  captchaResponse: string;
  myDatePickerOptions: IAngularMyDpOptions;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private locationService: LocationService,
              private snackBar: MatSnackBar,
              private fieldsService: ProfileFieldService,
              private router: Router,
              public dialog: MatDialog) {
              
    let earliestDate = new Date();
    earliestDate.setFullYear( earliestDate.getFullYear() - 18);
    this.myDatePickerOptions = {
      dateRange: false,
      defaultView: 3,
      minYear: earliestDate.getFullYear() - 120,
      maxYear: earliestDate.getFullYear()
    };
    
    let model: IMyDateModel = {isRange: false, singleDate: {jsDate: earliestDate}, dateRange: null};

    this.joinForm = this.fb.group({
      'birthday': [model, Validators.required],
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
    this.dialog.open(MediaDialog);

    this.setCurrentLocation();
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

  async setCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    if(!coordinates) {
      return;
    }

    this.locationService.getCurrentLocation(coordinates.coords.latitude, coordinates.coords.longitude)
    .subscribe(
      (result) => {
        this.defaultCountry = {countryId:result.countryId, countryName: result.countryName};
        this.defaultRegion = {regionId:result.regionId, regionName:result.regionName};
        this.defaultCity = {cityId:result.cityId, cityName:result.cityName};

        this.joinForm.patchValue({ country: this.countries.find(c => c.countryId === this.defaultCountry.countryId) });
      },
      (error) => {
        console.log(error);
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
          this.joinForm.patchValue({ country:  this.defaultCountry ? this.countries.find(c => c.countryId === this.defaultCountry.countryId) : this.countries[0] });
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
    if (!country.countryId) {
      return;
    }

    SharedService.showLoader.next(true);
    this.locationService.getRegions(country.countryId)
      .subscribe(
        (result) => {
          this.regions = result;
          this.cities = null;

          if (this.defaultRegion && country.countryId === this.defaultCountry.countryId) {
            this.joinForm.patchValue({ region: this.regions.find(r => r.regionId === this.defaultRegion.regionId)  });
          }
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
    if (!region.regionId) {
      return;
    }

   SharedService.showLoader.next(true);
    this.locationService.getCities(region.regionId)
      .subscribe(
        (result) => {
          this.cities = result;
          if (this.defaultCity && region.regionId === this.defaultRegion.regionId) {
            this.joinForm.patchValue({ city: this.cities.find(c => c.cityId === this.defaultCity.cityId)  });
          }
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
      user.birthDate = this.joinForm.value.birthday.singleDate.jsDate.toISOString().slice(0, 10)

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

@Component({
  selector: 'media-dialog',
  templateUrl: 'media-dialog.html',
})
export class MediaDialog {}