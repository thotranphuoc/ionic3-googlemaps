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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-map-new',
  templateUrl: 'map-new.html',
})
export class MapNewPage {
  map: GoogleMap;
  marker: Marker;
  location: MyLocation;
  latLng: LatLng;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapNewPage');
    this.map = this.loadMap();
    this.getLocation().then((location) => {
      this.location = location;
      return this.moveMap2Location(this.map, location)
    }).then((res)=>{
      console.log(res);
      this.markerAdd(this.map, this.location.latLng);
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

  getLocation() {
    return this.map.getMyLocation()
  }

  moveMap2Location(map: GoogleMap, location: MyLocation) {
    return this.map.animateCamera({
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
