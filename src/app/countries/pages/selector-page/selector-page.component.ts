import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{


  public countriesByRegion: SmallCountry[]=[];
  public myForm: FormGroup=this.fb.group({
    region:['',Validators.required],
    country:['',Validators.required],
    borders:['',Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService:CountriesService
    ){}
  // Se ejecuta cuando se esta inicializando
  ngOnInit(): void {
   this.onRegionChanged();
  }

  get regions():Region[]{
    return this.countriesService.regions;
  }

  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')),
      // Me permite recibir un observable y suscribirme a otro observable
      switchMap((region)=>this.countriesService.getcountriesByRegion(region))
    )
    .subscribe(countries=>{
      this.countriesByRegion=countries
    });
  }


}
