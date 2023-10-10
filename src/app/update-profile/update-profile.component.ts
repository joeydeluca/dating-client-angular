import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {RecipientProfileService} from '../services/recipient-profile.service';
import {UserService} from '../services/user.service';
import {PhotoService} from '../services/photo.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {SharedService} from '../services/shared.service';
import {Country, Region, City} from '../models/Location';
import {ProfileFieldService} from '../services/profile-field.service';
import {LocationService} from '../services/location.service';
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user: User;

  detailsForm: any;
  essaysForm: any;
  partnerForm: any;

  fieldOptions: object;
  countries: Country[];
  regions: Region[];
  cities: City[];

  submitting: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private photoService: PhotoService,
    private locationService: LocationService,
    private fieldsService: ProfileFieldService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private recipientProfileService: RecipientProfileService) {
      this.user = new User();
      this.user.profile = new Profile();

      this.initDetailsForm();
      this.essaysForm = this.fb.group({});
      this.partnerForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadProfileFields();
    this.loadCountries();
    this.loadProfile(
      () => {
        this.initDetailsForm();
        this.initEssaysForm();
        this.initPartnerForm();
        this.loadRegions(this.user.profile.country, false);
        this.loadCities(this.user.profile.region);
      }
    );
  }

  private loadProfile(onSuccess): void {
    this.userService.getUser().subscribe(
        (user) => {
          this.user = user;
          onSuccess();
        },
        (error) => this.showError('Error loading profile')
    );
  }

  private initDetailsForm(): void {
    this.detailsForm = this.fb.group({
      'country': [this.user.profile.country, [Validators.required]],
      'region': [this.user.profile.region, [Validators.required]],
      'city': [this.user.profile.city, [Validators.required]],
      'ethnicity': [this.getDefaultValue(this.user.profile.ethnicity), [Validators.required]],
      'heightFeet': [this.user.profile.height ? this.user.profile.height.feet : '', [Validators.required]],
      'heightInches': [this.user.profile.height ? this.user.profile.height.inches : '', [Validators.required]],
      'bodyType': [this.getDefaultValue(this.user.profile.bodyType), [Validators.required]],
      'eyeColor': [this.getDefaultValue(this.user.profile.eyeColor), [Validators.required]],
      'hairColor': [this.getDefaultValue(this.user.profile.hairColor), [Validators.required]],
      'pet': [this.user.profile.pet],
      'language': [this.user.profile.language, [Validators.required]],
      'religion': [this.getDefaultValue(this.user.profile.religion), [Validators.required]],
      'occupation': [this.getDefaultValue(this.user.profile.occupation), [Validators.required]],
      'salary': [this.getDefaultValue(this.user.profile.salary)],
      'childrenStatus': [this.getDefaultValue(this.user.profile.childrenStatus), [Validators.required]],
      'astroSign': [this.getDefaultValue(this.user.profile.astroSign)],
      'education': [this.getDefaultValue(this.user.profile.education), [Validators.required]],
      'smoke': [this.getDefaultValue(this.user.profile.smoke), [Validators.required]],
      'drink': [this.getDefaultValue(this.user.profile.drink), [Validators.required]]
      });
  }

  private initEssaysForm(): void {
    this.essaysForm = this.fb.group({
      'aboutMe': [this.user.profile.aboutMe, [Validators.maxLength(4000)]],
      'partnerDescription': [this.user.profile.partnerDescription, [Validators.maxLength(4000)]],
      'perfectDate': [this.user.profile.perfectDate, [Validators.maxLength(4000)]],
    });
  }

  private initPartnerForm(): void {
    this.partnerForm = this.fb.group({
      'partnerEthnicity': [this.user.profile.partnerEthnicity],
      'partnerBodyType': [this.user.profile.partnerBodyType],
      'partnerEyeColor': [this.user.profile.partnerEyeColor],
      'partnerHairColor': [this.user.profile.partnerHairColor],
      'partnerPet': [this.user.profile.partnerPet],
      'partnerLanguage': [this.user.profile.partnerLanguage],
      'partnerReligion': [this.user.profile.partnerReligion],
      'partnerOccupation': [this.user.profile.partnerOccupation],
      'partnerSalary': [this.user.profile.partnerSalary],
      'partnerChildrenStatus': [this.user.profile.partnerChildrenStatus],
      'partnerAstroSign': [this.user.profile.partnerAstroSign],
      'partnerEducation': [this.user.profile.partnerEducation],
      'partnerSmoke': [this.user.profile.partnerSmoke],
      'partnerDrink': [this.user.profile.partnerDrink],
    });
  }

  private getDefaultValue(input: string): string {
    return input ? input : '';
  }

  private loadProfileFields(): void {
    this.fieldsService.getProfileFields()
      .subscribe(
        (result) => {
          this.fieldOptions = result;
        },
        (error) => this.showError('Error loading fields')
      );
  }

  private loadCountries(): void {
    this.locationService.getCountries()
      .subscribe(
        (result) => {
          this.countries = result;
        },
        (error) => this.showError('Error fetching country list')
      );
  }

  loadRegions(country: Country, patch: boolean) {
    this.locationService.getRegions(country.countryId)
      .subscribe(
        (result) => {
          this.regions = result;
          if (this.regions && patch) {
            (<FormGroup>this.detailsForm).patchValue({region: this.regions[0]});
          }
        },
        (error) => this.showError('Error fetching region list')
      );
  }

  loadCities(region: Region) {
    if (!region) {
      return;
    }

    this.locationService.getCities(region.regionId)
      .subscribe(
        (result) => {
          this.cities = result;
        },
        (error) => this.showError('Error fetching city list')
      );
  }

  onSubmitDetails(): void {
    if (this.detailsForm.valid) {
      this.submitting = true;
      SharedService.showLoader.next(true);
      const profile = this.user.profile;
      profile.country = this.detailsForm.value.country;
      profile.region = this.detailsForm.value.region;
      profile.city = this.detailsForm.value.city;
      profile.ethnicity = this.detailsForm.value.ethnicity;
      profile.height = {feet: this.detailsForm.value.heightFeet, inches: this.detailsForm.value.heightInches};
      profile.bodyType = this.detailsForm.value.bodyType;
      profile.eyeColor = this.detailsForm.value.eyeColor;
      profile.hairColor = this.detailsForm.value.hairColor;
      profile.pet = this.detailsForm.value.pet;
      profile.language = this.detailsForm.value.language;
      profile.religion = this.detailsForm.value.religion;
      profile.occupation = this.detailsForm.value.occupation;
      profile.salary = this.detailsForm.value.salary;
      profile.childrenStatus = this.detailsForm.value.childrenStatus;
      profile.astroSign = this.detailsForm.value.astroSign;
      profile.education = this.detailsForm.value.education;
      profile.smoke = this.detailsForm.value.smoke;
      profile.drink = this.detailsForm.value.drink;
      this.updateProfile(profile);
    }
  }

  onSubmitEssays(): void {
    if (this.essaysForm.valid) {
      this.submitting = true;
      SharedService.showLoader.next(true);
      const profile = this.user.profile;
      profile.aboutMe = this.essaysForm.value.aboutMe;
      profile.partnerDescription = this.essaysForm.value.partnerDescription;
      profile.perfectDate = this.essaysForm.value.perfectDate;
      this.updateProfile(profile);
    }
  }

  onSubmitPartner(): void {
    if (this.partnerForm.valid) {
      this.submitting = true;
      SharedService.showLoader.next(true);
      const profile = this.user.profile;
      profile.partnerEthnicity = this.partnerForm.value.partnerEthnicity;
      profile.partnerBodyType = this.partnerForm.value.partnerBodyType;
      profile.partnerEyeColor = this.partnerForm.value.partnerEyeColor;
      profile.partnerHairColor = this.partnerForm.value.partnerHairColor;
      profile.partnerPet = this.partnerForm.value.partnerPet;
      profile.partnerLanguage = this.partnerForm.value.partnerLanguage;
      profile.partnerReligion = this.partnerForm.value.partnerReligion;
      profile.partnerOccupation = this.partnerForm.value.partnerOccupation;
      profile.partnerSalary = this.partnerForm.value.partnerSalary;
      profile.partnerChildrenStatus = this.partnerForm.value.partnerChildrenStatus;
      profile.partnerAstroSign = this.partnerForm.value.partnerAstroSign;
      profile.partnerEducation = this.partnerForm.value.partnerEducation;
      profile.partnerSmoke = this.partnerForm.value.partnerSmoke;
      profile.partnerDrink = this.partnerForm.value.partnerDrink;
      this.updateProfile(profile);
    }
  }

  onPhotoUploadSuccess(): void {
    this.getUserFromServer();
  }

  setProfilePhoto(photoId: number): void {
    SharedService.showLoader.next(true);
    this.photoService.setProfilePhoto(photoId).subscribe(
      (photo) => {
        SharedService.showLoader.next(false);
        this.showSucess('Profile photo set');
        this.getUserFromServer();
        window.scrollTo(0, 0);
      },
      (error) => {
        SharedService.showLoader.next(false);
        this.showError('Operation failed');
      }
    );
  }

  deletePhoto(photoId: number): void {
    SharedService.showLoader.next(true);
    this.photoService.deletePhoto(photoId).subscribe(
      (photo) => {
        SharedService.showLoader.next(false);
        this.showSucess('Photo deleted');
        this.getUserFromServer();
        window.scrollTo(0, 0);
      },
      (error) => {
        SharedService.showLoader.next(false);
        this.showError('Operation failed');
      }
    );
  }

  private updateProfile(profile: Profile): void {
    this.userService.updateProfile(profile)
        .subscribe(
        (result) => {
          this.user = result;
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.showSucess('Profile Updated');
        },
        (error) => {
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.showError(error);
        }
      );
  }

  private showError(message: string) {
    this.snackBar.open(message, null, {
      duration: 4000,
      panelClass: ['bg-danger', 'snackbar']
    });
  }

  private showSucess(message: string) {
    this.snackBar.open(message, null, {
      duration: 4000,
      panelClass: ['bg-success', 'snackbar']
    });
  }

  private getUserFromServer(): void {
    this.userService.getUserFromServer()
    .subscribe(
        (result) => {
          this.user = result;
          SharedService.showLoader.next(false);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  compareByCountryId(item1: Country, item2: Country) {
    return item1 && item2 && item1.countryId === item2.countryId;
  }
  compareByRegionId(item1: Region, item2: Region) {
    return item1 && item2 && item1.regionId === item2.regionId;
  }
  compareByCityId(item1: City, item2: City) {
    return item1 && item2 && item1.cityId === item2.cityId;
  }

}
