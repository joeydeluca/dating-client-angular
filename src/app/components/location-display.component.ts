import {Component, Input} from "@angular/core";
import {Country,Region,City} from "../models/Location";

@Component({
  selector: 'location-display',
  template: `
        <span *ngIf="!!country && !!city && !!city.cityId">{{city.cityName}}, </span>
        <span *ngIf="!!country && !!region && !!region.regionId">{{region.regionName}}, </span>
        <span *ngIf="!!country">{{country.countryName}} </span>
  `
})
export class LocationDisplayComponent {
    @Input() country: Country;
    @Input() region: Region;
    @Input() city: City;
}