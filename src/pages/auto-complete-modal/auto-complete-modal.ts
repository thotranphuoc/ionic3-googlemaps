import { Component, NgZone } from '@angular/core';
import { IonicPage, } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { LangService } from '../../services/lang.service';


declare var google: any;

/**
 * Generated class for the AutoCompleteModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auto-complete-modal',
  templateUrl: 'auto-complete-modal.html',
})
export class AutoCompleteModalPage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    placeholderAddress : { EN: 'Enter the name', VI : 'Nhập địa chỉ'},
  };
  pageId = 'AutoCompleteModalPage';

  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any

  service: any; // new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, 
    private zone: NgZone,
    private localService: LocalService,
    private langService: LangService
    
    ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  convertArray2Object() {
    let OBJ: any = {}
    try {
      if(this.localService.BASIC_INFOS.LANGUAGES[this.pageId]!=null)
      {
        let LANGUAGES: any[] = this.localService.BASIC_INFOS.LANGUAGES[this.pageId];
        LANGUAGES.forEach(L => {
          OBJ[L.KEY] = L
        })
        console.log(OBJ);
      }
    } catch (error) {
      OBJ=null;
    }
    return OBJ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapNewPage');
    setTimeout(() => {
      this.service = new google.maps.places.AutocompleteService();
      console.log(this.service);
    }, 1000);
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
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
      this.viewCtrl.dismiss(DATA);
    })
    

    // this.geo = item;
    // this.geoCode(this.geo);//convert Address to lat and long
  }

  updateSearch() {

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
