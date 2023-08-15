import { Injectable } from '@angular/core';
import { Region, SmallCountry } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions:Region[]=[Region.Africa,Region.Americas,Region.Asia,Region.Europe,Region.Oceania,]

  constructor() { }

  get regions():Region[]{
    // Con esto rompo la relación con las regiones y evito que lo dañen
    return [...this._regions];
  }

  getcountriesByRegion(region:Region):SmallCountry[]{

    return [];
  }
}
