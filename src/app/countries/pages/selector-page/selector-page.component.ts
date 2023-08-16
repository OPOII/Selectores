import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{


  public countriesByRegion: SmallCountry[]=[];
  public borders: SmallCountry[]=[];
  public myForm: FormGroup=this.fb.group({
    region:['',Validators.required],
    country:['',Validators.required],
    border:['',Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService:CountriesService
    ){}
  // Se ejecuta cuando se esta inicializando
  ngOnInit(): void {
   this.onRegionChanged();
   this.onCountryChange();
  }

  get regions():Region[]{
    return this.countriesService.regions;
  }

  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')),
      tap(()=>this.borders=[]),
      // Me permite recibir un observable y suscribirme a otro observable
      switchMap((region)=>this.countriesService.getcountriesByRegion(region))
    )
    .subscribe(countries=>{
      this.countriesByRegion=countries
    });
  }

  onCountryChange():void{
    this.myForm.get('country')!.valueChanges
    .pipe(
      // Añade un efecto secundario
      tap(()=>this.myForm.get('border')!.setValue('')),
      // Filtra en caso de que el valor no sea mayor a 0
      filter((value:string)=>value.length>0),
      // Me permite recibir un observable y suscribirme a otro observable
      switchMap((alphacode)=>this.countriesService.getCountryByAlphaCode(alphacode)),
      switchMap((country)=>this.countriesService.getCountryBordersByCodes(country.borders))
    )
    .subscribe(country=>{
      this.borders=country;
      // this.countriesByRegion=countries
    });
  }

}
