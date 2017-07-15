export class Country {
  countryId: string;
  countryName: string;
}

export class Region {
  regionId: string;
  regionName: string;
}

export class City {

  constructor(cityName: string) {
    this.cityName = cityName;
  }

  cityId: string;
  cityName: string;
}
