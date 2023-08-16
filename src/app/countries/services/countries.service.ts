import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl:string='https://restcountries.com/v3.1';

  private _regions:Region[]=[Region.Africa,Region.Americas,Region.Asia,Region.Europe,Region.Oceania,]

  constructor(
    private http: HttpClient
  ) { }

  get regions():Region[]{
    // Con esto rompo la relación con las regiones y evito que lo dañen
    return [...this._regions];
  }

  getcountriesByRegion(region:Region):Observable<SmallCountry[]>{
    if(!region) return of([]);

    const url:string=`${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url).pipe(
      // El map de rxjs toma la response para poder regresar otra cosa, lo transforma y le pasa la siguiente información (transformada)
      // El metodo map de los arreglos itera sobre los country para regresar el objeto que necesito
      map(countries=>countries.map(country=>({
        name:country.name.common,
        cca3:country.cca3,
        borders:country.borders??[]
      }))),
    );
  }

  getCountryByAlphaCode(alphaCode:string):Observable<SmallCountry>{

    const url=`${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map(country=>({
        name: country.name.common,
        cca3:country.cca3,
        borders:country.borders??[]
      }))
    );
  }
}
