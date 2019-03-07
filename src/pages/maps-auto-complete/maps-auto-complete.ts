import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google: any;
@IonicPage()
@Component({
  selector: 'page-maps-auto-complete',
  templateUrl: 'maps-auto-complete.html',
})
export class MapsAutoCompletePage {
  text;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsAutoCompletePage');
  }

  getItems(e: any){
    console.log(e);
    console.log(e.target.value);

    let inputStr = e.target.value
    let autocomplete = new google.maps.places.Autocomplete(e.target);
    console.log(autocomplete);

    let place = autocomplete.getPlace();
    let bounds = autocomplete.getBounds();
    console.log(place, bounds);
    // if (!place.geometry) {
    //   // User entered the name of a Place that was not suggested and
    //   // pressed the Enter key, or the Place Details request failed.
    //   window.alert("No details available for input: '" + place.name + "'");
    //   return;
    // }else{
    //   console.log(place.geometry);
    // }

    // // If the place has a geometry, then present it on a map.
    // if (place.geometry.viewport) {
    //   map.fitBounds(place.geometry.viewport);
    // } else {
    //   map.setCenter(place.geometry.location);
    //   map.setZoom(17);  // Why 17? Because it looks good.
    // }
    console.log(this.text);
  }

  getCode(){
    console.log(this.text);
  }
}
