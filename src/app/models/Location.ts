export class Country {
  countryId: string;
  countryName: string;

/*  constructor(countryId: string) {
    this.countryId = countryId;
  }*/
}

export class Region {
  regionId: string;
  regionName: string;

  // constructor(regionId: string) {
  //   this.regionId = regionId;
  // }
}

export class City {
  cityId: string;
  cityName: string;

  constructor(cityId: string) {
    this.cityId = cityId;
  }
}
