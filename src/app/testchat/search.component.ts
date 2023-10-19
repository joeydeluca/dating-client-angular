import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Country, Region, City} from '../models/Location';
import {SharedService} from '../services/shared.service';
import {LocationService} from '../services/location.service';
import {RecipientProfileService} from '../services/recipient-profile.service';
import {Profile} from '../models/Profile';
import {Page} from '../models/Page';
import {RecipientProfile} from '../models/RecipientProfile';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class TestChatComponent implements OnInit, OnDestroy {

  SELECT_ALL = 'All';

  countries: Country[];
  regions: Region[];
  cities: City[];

  selectedCountry: Country;
  selectedRegion: Region;
  selectedCity: City;

  selectedAgeFrom = 18;
  selectedAgeTo = 65;

  profile: Profile;

  ages: Array<number> = new Array();

  genderSeeking: string;

  profilePage: Page<RecipientProfile>;

  frendtoken: String;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private locationService: LocationService,
              private authService: AuthService,
              private recipientProfileService: RecipientProfileService,
              private router: Router,
              private route: ActivatedRoute,
              private window: Window) {
  }

  ngOnInit(): void {
    for (let x = 18; x <= 100; x++) {
      this.ages.push(x);
    }

    this.genderSeeking = this.getGenderSeeking();

    this.route.params.subscribe((params: Params) => {

      this.selectedAgeFrom = params['ageFrom'] ? params['ageFrom'] : this.selectedAgeFrom;
      this.selectedAgeTo = params['ageTo'] ? params['ageTo'] : this.selectedAgeTo;

      this.userService.getUser().subscribe(
        (user) => {
          this.profile = user.profile;

          const useProfileValues = Object.keys(params).length === 0;

          if (params['countryId'] && params['countryName']) {
            const country = <Country>{countryId: params['countryId'], countryName: params['countryName']};
            this.selectedCountry = country;
          } else {
            this.selectedCountry = this.profile.country;
          }

          if (params['regionId'] && params['regionName']) {
            const region = <any>{regionId: params['regionId'], regionName: params['regionName']};
            this.selectedRegion = region;
          } else {
            this.selectedRegion = useProfileValues ? this.profile.region : this.getSelectAllRegion();
          }

          if (params['cityId'] && params['cityName']) {
            const city = <any>{cityId: params['cityId'], cityName: params['cityName']};
            this.selectedCity = city;
          } else {
            this.selectedCity = this.getSelectAllCity();
          }

          this.loadProfiles(params['page'] ? params['page'] : 0);

          this.loadCountries();
          this.loadRegions(this.selectedCountry);
          this.loadCities(this.selectedRegion);
        },
        () => {
          this.snackBar.open('Error retrieving your profile', null, {
              duration: 4000,
              panelClass: ['bg-danger', 'snackbar']
            });
        }
      );
    });


    this.authService.getFrendToken().subscribe((res) => {
      //this.saveAuthContextToLocal(res);
      this.frendtoken = res;
      try {
        (<any>this.window).initChat(this.frendtoken, 'www.uglyschmucks.com/frend-upgrade');
      } catch (e) {
        console.log(e);
      }
    }, (error) => {console.log(error)});
  }

  ngOnDestroy(): void {
    localStorage.setItem('search-scroll-y', window.scrollY.toString());
  }

  getGenderSeeking(): string {
      return this.authService.getAuthContextFromLocal().genderSeeking == 'M' ? 'Men' : 'Women';
  }

  loadCountries() {
    this.locationService.getCountries()
      .subscribe(
        (result) => {
          this.countries = result;
        },
        (error) => {
          this.snackBar.open('Error fetching Country list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadRegions(country: Country) {
    if (!country) {
      this.clearRegions();
      this.clearCities();
      return;
    }

    this.locationService.getRegions(country.countryId)
      .subscribe(
        (result) => {
          if (result.length > 0) {
            result.unshift(this.getSelectAllRegion());
            this.regions = result;
          }
        },
        (error) => {
          this.snackBar.open('Error fetching Region list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

   loadCities(region: Region) {
    if (!region || !region.regionId) {
      this.clearCities();
      return;
    }

    this.locationService.getCities(region.regionId)
      .subscribe(
        (result) => {
          if (result.length > 0) {
            result.unshift(this.getSelectAllCity());
            this.cities = result;
          }
        },
        (error) => {
          this.snackBar.open('Error fetching City list', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
          });
        }
      );
  }

  loadProfiles(pageNumber: number) {
    SharedService.showLoader.next(true);
    this.userService.searchProfiles(
          pageNumber,
          this.selectedAgeFrom,
          this.selectedAgeTo,
          this.selectedCountry ? this.selectedCountry.countryId : '',
          this.selectedRegion ? this.selectedRegion.regionId : '',
          this.selectedCity ? this.selectedCity.cityId : ''
        )
        .subscribe(
          (result) => {
            this.profilePage = result;

            SharedService.showLoader.next(false);

            const scrollY = localStorage.getItem('search-scroll-y');
              if (scrollY) {
                setTimeout(() => {
                window.scrollTo(0, parseInt(scrollY));
                localStorage.removeItem('search-scroll-y');
                }, 100);
              } else {
                window.scrollTo(0, 0);
              }

          },
          (error) => {
            SharedService.showLoader.next(false);
            this.snackBar.open(error, null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
            });
        });
  }

  sendFlirt(recipientUserId: number, recipientUsername: string): void {
    if (!this.authService.getAuthContext().paid) {
      this.snackBar.open('This feature requires an upgraded membership', null, {
        duration: 4000,
        panelClass: ['bg-warning', 'snackbar']
      });
      this.router.navigate(['/upgrade']);
      return;
    }

    SharedService.showLoader.next(true);
    this.recipientProfileService.sendFlirt(recipientUserId)
      .subscribe(() => {
        SharedService.showLoader.next(false);
         this.snackBar.open(`You sent a flirt to ${recipientUsername}`, null, {
            duration: 4000,
            panelClass: ['bg-success', 'snackbar']
            });
      },
      (error) => {
        SharedService.showLoader.next(false);
        console.error(error);
         this.snackBar.open('Error sending flirt', null, {
            duration: 4000,
            panelClass: ['bg-danger', 'snackbar']
            });
      });
  }

  loadFirstPage() {
    this.router.navigate(['/search', this.getSearchCriteriaParams(0)]);
    this.profilePage = null;
  }

  loadNextPage() {
    this.router.navigate(['/search', this.getSearchCriteriaParams(this.profilePage.number + 1)]);
    this.profilePage = null;
  }

  loadPreviousPage() {
    this.router.navigate(['/search', this.getSearchCriteriaParams(this.profilePage.number - 1)]);
    this.profilePage = null;
  }

  viewRecipientProfile(recipientProfileId: number) {
    this.router.navigate(['/view-profile', recipientProfileId]);
  }

  clearRegions(): void {
    this.regions = [];
    this.regions.push(this.getSelectAllRegion());
    this.selectedRegion = this.regions[0];

  }

  clearCities(): void {
    this.cities = [];
    this.cities.push(this.getSelectAllCity());
    this.selectedCity = this.cities[0];
  }

  getSelectAllCity(): City {
    return <City>{cityId: '', cityName: this.SELECT_ALL};
  }

  getSelectAllRegion(): Region {
    return <Region>{regionId: '', regionName: this.SELECT_ALL};
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

  getSearchCriteriaParams(pageNumber: number) {
    return {
      page: pageNumber,
      ageFrom: this.selectedAgeFrom,
      ageTo: this.selectedAgeTo,
      countryId: this.selectedCountry.countryId,
      countryName: this.selectedCountry.countryName,
      regionId: this.selectedRegion ? this.selectedRegion.regionId : '',
      regionName: this.selectedRegion ? this.selectedRegion.regionName : '',
      cityId: this.selectedCity ? this.selectedCity.cityId : '',
      cityName: this.selectedCity ? this.selectedCity.cityName : ''
    };
  }

}
