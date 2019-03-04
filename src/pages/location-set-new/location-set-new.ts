import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-location-set-new',
  templateUrl: 'location-set-new.html',
})
export class LocationSetNewPage {
  map: GoogleMap;
  location: any;
  constructor(
    public toastCtrl: ToastController,
    private viewCtrl: ViewController,
    ) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas1', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });

  }

  onButtonClick() {
    console.log(this.map);
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location, null ,2));
        this.location = location;
        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        })
        .then(() => {
          // add a marker
          let marker: Marker = this.map.addMarkerSync({
            title: 'Chọn vị trí',
            snippet: 'Vị trí bạn chọn',
            position: location.latLng,
            animation: GoogleMapsAnimation.BOUNCE
          });

          // show the infoWindow
          marker.showInfoWindow();

          // If clicked it, display the alert
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast(this.location.json());
          });
        });
      });
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }

  setLocation() {
    // let NEW_LOCATION = {
    //   lat: Number(this.NEW_SELECTED_LOCATION.lat.toFixed(8)),
    //   lng: Number(this.NEW_SELECTED_LOCATION.lng.toFixed(8))
    // }
    let NEW_LOCATION = this.location.latLng;
    console.log(NEW_LOCATION);
    // this.viewCtrl.dismiss({ NEW_LOCATION: this.NEW_SELECTED_LOCATION })
    this.viewCtrl.dismiss({ NEW_LOCATION: NEW_LOCATION })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
  }
}
