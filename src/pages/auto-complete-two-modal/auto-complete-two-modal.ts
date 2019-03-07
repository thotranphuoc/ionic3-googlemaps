import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';


declare var google: any;
/**
 * Generated class for the AutoCompleteTwoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auto-complete-two-modal',
  templateUrl: 'auto-complete-two-modal.html',
})
export class AutoCompleteTwoModalPage {

  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;

  autocompleteItemsto;
  autocompleteto;

  latitudeto: number = 0;
  longitudeto: number = 0;
  geo: any

  service: any; // new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    this.autocompleteItemsto = [];
    this.autocompleteto = {
      queryto: ''
    };
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.service = new google.maps.places.AutocompleteService();
      console.log(this.service);
    }, 1000);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.getGeoCode(item).then((res)=>{
      let DATA = {
        latLng: res,
        address: item
      }
      console.log(DATA);
      this.viewCtrl.dismiss(DATA);
    })
    
    // this.geo = item;
    // this.geoCode(this.geo);//convert Address to lat and long
  }

  chooseItemto(item: any) {
    this.getGeoCode(item).then((res)=>{
      let DATAto = {
        latLng: res,
        address: item
      }
      console.log(DATAto);
      this.viewCtrl.dismiss(DATAto);
    })
    // this.geo = item;
    // this.geoCode(this.geo);//convert Address to lat and long
  }

  updateSearchFrom() {

    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {
        country: 'VN'
      }
    }, (predictions, status) => {
      me.autocompleteItems = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  updateSearchTo() {

    if (this.autocomplete.queryto == '') {
      this.autocompleteItemsto = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.queryto,
      componentRestrictions: {
        country: 'VN'
      }
    }, (predictions, status) => {
      me.autocompleteItemsto = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItemsto.push(prediction.description);
          });
        }
      });
    });
  }

  //convert Address string to lat and long
  getGeoCode(address: any) {
    return new Promise((resolve, reject) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        let latitude = results[0].geometry.location.lat();
        let longitude = results[0].geometry.location.lng();
        resolve({ lat: latitude, lng: longitude });
      });
    })
  }

}
