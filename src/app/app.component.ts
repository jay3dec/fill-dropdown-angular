import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import csc from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  countryDropdownSettings;
  stateDropdownSettings;
  cityDropdownSettings;
  form: FormGroup;
  countries : ICountry[] = [];
  states : IState[] = [];
  cities : ICity[] = [];
  selectedCountryCode : String;

  subscriptions : Subscription[] = [];
  constructor(private formBuilder : FormBuilder){}

  ngOnInit(){
    this.initForm();
    this.initDropdownSettings();
    this.getCountries();
    this.handleValueChanges();
  }

  handleValueChanges(){
    this.subscriptions.push(this.form.get('country').valueChanges.subscribe((response) => {
      this.selectedCountryCode = response[0].isoCode;
      this.getState(response[0].isoCode);
    }));

    this.subscriptions.push(this.form.get('state').valueChanges.subscribe((response) => {
      this.getCity(this.selectedCountryCode,response[0].isoCode);
    }))
  }

  initDropdownSettings(){
    this.countryDropdownSettings = {
      singleSelection: true,
      idField: 'isoCode',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight : '100'
    };
  }

  getCountries(){
    this.countries = csc.getAllCountries();
  }

  getState(countryCode){
    this.states = csc.getStatesOfCountry(countryCode);
  }

  getCity(countryCode, stateCode){
    this.cities = csc.getCitiesOfState(countryCode, stateCode);
  }

  initForm(){
    this.form = this.formBuilder.group({
      country : [''],
      state : [''],
      city : ['']
    })
  }

  handleButtonClick(){
    if(!this.form.valid) this.form.markAllAsTouched();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(item => {
      if(item) item.unsubscribe();
    })
  }

}


