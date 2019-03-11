import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  LatLng
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-map-new',
  templateUrl: 'map-new.html',
})
export class MapNewPage {
  googleMap: GoogleMap;
  marker: Marker;
  location: MyLocation;
  latLng: LatLng;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapNewPage');
    this.googleMap = this.loadMap();
    this.getMyLocation().then((location) => {
      this.location = location;
      return this.moveMap2Location(this.googleMap, location)
    }).then((res)=>{
      console.log(res);
      this.markerAdd(this.googleMap, this.location.latLng);
      this.showMarker();
    })
  }

  loadMap() {
    let OPTION = {
      target: {
        lat: 43.0741704,
        lng: -89.3809802
      },
      zoom: 18,
      tilt: 30
    }
    return GoogleMaps.create('map_new_canvas', OPTION);
  }

  getMyLocation() {
    return this.googleMap.getMyLocation()
  }

  moveMap2Location(map: GoogleMap, location: MyLocation) {
    return this.googleMap.animateCamera({
      target: location.latLng,
      zoom: 17,
    })
  }

  markerAdd(map: GoogleMap, latLng: LatLng) {
    this.marker = map.addMarkerSync({
      title: 'Chọn vị trí',
      snippet: 'Vị trí bạn chọn',
      position: latLng,
      animation: GoogleMapsAnimation.BOUNCE
    });
  }

  showMarker() {
    this.marker.showInfoWindow();
    this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((e: Event) => {
      console.log(e);
    })
  }
}
