import { Component, NgZone } from '@angular/core';
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

  autocomplete2 = {
    queryFrom: '',
    queryTo: ''
  }
  autocompleteItems2 = {
    To: [],
    From: []
  }
  DATA2 = {
    From: {
      latLng: null,
      address: ''
    },
    To: {
      latLng: null,
      address: ''
    },
  }

  isFromSelected: boolean = false;
  isToSelected: boolean = false;

  latitude: number = 0;
  longitude: number = 0;

  autocompleteItemsto;
  autocompleteto;

  latitudeto: number = 0;
  longitudeto: number = 0;

  DATA: any;
  DATAto: any;
  geo: any;

  HideForm = 0;
  HideTo = 0;

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
    this.getGeoCode(item).then((res) => {
      let DATA = {
        latLng: res,
        address: item
      }
      console.log(DATA);
      this.DATA = DATA;
      this.autocomplete.query = item;
      this.HideForm = 1;
      //this.viewCtrl.dismiss(DATA);
    })

    // this.geo = item;
    // this.geoCode(this.geo);//convert Address to lat and long
  }

  chooseItemto(item: any) {
    this.getGeoCode(item).then((res) => {
      let DATAto = {
        latLng: res,
        address: item
      }
      console.log(DATAto);
      this.DATAto = DATAto;
      this.autocompleteto.queryto = item;
      this.HideTo = 1;
      //this.viewCtrl.dismiss(DATAto);
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

  chooseItem2(item: any, direction: string) {
    if (direction == 'To') {
      this.autocomplete2.queryTo = item;
      this.isToSelected = true;
      this.getGeoCode(item).then(res => {
        this.DATA2.To.latLng = res;
        this.DATA2.To.address = item;
        this.doDismiss();
      })
    }
    if (direction == 'From') {
      this.autocomplete2.queryFrom = item;
      this.isFromSelected = true;
      this.getGeoCode(item).then(res => {
        this.DATA2.From.latLng = res;
        this.DATA2.From.address = item;
        this.doDismiss();
      })
    }
  }

  doDismiss(){
    console.log(this.DATA2);
    if (this.isFromSelected && this.isToSelected) {
      this.viewCtrl.dismiss(this.DATA2);
    }
  }

  updateSearch2From() {
    console.log(this.autocomplete2);
    if (this.autocomplete2.queryFrom == '') {
      this.autocompleteItems2.From = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete2.queryFrom,
      componentRestrictions: {
        country: 'VN'
      }
    }, (predictions, status) => {
      me.autocompleteItems2.From = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems2.From.push(prediction.description);
          });
        }
      });
    });
  }

  updateSearch2To() {
    console.log(this.autocomplete2);
    if (this.autocomplete2.queryTo == '') {
      this.autocompleteItems2.To = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete2.queryTo,
      componentRestrictions: {
        country: 'VN'
      }
    }, (predictions, status) => {
      me.autocompleteItems2.To = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems2.To.push(prediction.description);
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
