import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GmapService } from '../../services/gmap.service';
import { LoadingService } from '../../services/loading.service';

import { iPosition } from '../../interfaces/position.interface';
import { LocalService } from '../../services/local.service';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-location-set',
  templateUrl: 'location-set.html',
})
export class LocationSetPage {
  data: any;
  loading: any;
  mapEl: any;
  map: any;
  userMarker: any;
  CURRENT_LOCATION: iPosition = null;
  USER_CURRENT_LOCATION: iPosition = null;
  NEW_SELECTED_LOCATION: iPosition = null;
  isOrigMarkerLoaded: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private gmapService: GmapService,
    private loadingService: LoadingService,
    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.CURRENT_LOCATION = this.data.CURRENT_LOCATION;
    this.USER_CURRENT_LOCATION = this.localService.USER_CURRENT_LOCATION;
    console.log(this.USER_CURRENT_LOCATION);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.loadingService.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map1');
      this.initMap(this.mapEl)
    }, 1500)
  }

  reloadMap() {
    this.initMap(this.mapEl);
    this.isOrigMarkerLoaded = false;
  }

  initMap(mapElement) {
    console.log('start initMap()')
    if (this.CURRENT_LOCATION && this.CURRENT_LOCATION.lat !== 0 && this.CURRENT_LOCATION.lng !== 0) {
      console.log('user location set');
      console.log(this.CURRENT_LOCATION)
      this.showMap(this.CURRENT_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      this.gmapService.getCurrentLocation()
        .then((pos: iPosition) => {
          console.log(pos);
          this.showMap(pos, mapElement);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }


  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        this.loadingService.hideLoading();
        console.log(map);
        this.map = map;
        this.gmapService.addBlueDotToMap(this.map, this.USER_CURRENT_LOCATION);
        // when maps is loaded and become idle
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.loadingService.hideLoading();

          if (!this.isOrigMarkerLoaded) {
            this.addMarker(position);
            this.NEW_SELECTED_LOCATION = position;
            this.isOrigMarkerLoaded = true;
          }
        })

        google.maps.event.addListener(this.map, 'click', (event) => {
          this.userMarker.setMap(null);
          let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(positionClick);
          this.addMarker(positionClick);
          this.NEW_SELECTED_LOCATION = positionClick;
          this.isOrigMarkerLoaded = true;
        })



      })
      .catch((err) => { console.log(err); })
  }

  addMarker(pos) {
    if (typeof (this.userMarker) !== 'undefined') {
      this.userMarker.setMap(null)
    }
    this.userMarker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: 'New Value',
      draggable: true
    })

    this.userMarker.addListener('dragend', (event) => {
      console.log(event);
      let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      console.log(positionClick);
      this.NEW_SELECTED_LOCATION = positionClick;
      this.isOrigMarkerLoaded = true;
    })
  }

  setLocation() {
    let NEW_LOCATION = {
      lat: Number(this.NEW_SELECTED_LOCATION.lat.toFixed(8)),
      lng: Number(this.NEW_SELECTED_LOCATION.lng.toFixed(8))
    }
    console.log(NEW_LOCATION);
    // this.viewCtrl.dismiss({ NEW_LOCATION: this.NEW_SELECTED_LOCATION })
    this.viewCtrl.dismiss({ NEW_LOCATION: NEW_LOCATION })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
  }

  cancelLocation() {
    this.viewCtrl.dismiss({ NEW_LOCATION: this.CURRENT_LOCATION })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
  }

  centerMap() {
    this.isOrigMarkerLoaded = false;
    console.log('center Map');
    console.log(this.map);
    if (this.USER_CURRENT_LOCATION) {
      this.setCenter();
    }else{
      this.gmapService.getCurrentLocation().then((res: any)=>{
        console.log(res);
        this.USER_CURRENT_LOCATION = res;
        this.setCenter();
      })
    }
  }
  setCenter(){
    this.map.setCenter(this.USER_CURRENT_LOCATION);
      this.userMarker.setMap(null);
      this.userMarker = new google.maps.Marker({
        position: this.USER_CURRENT_LOCATION,
        map: this.map,
      })
      // this.gmapService.addMarkerToMapWithNewLocation(this.map,this.USER_CURRENT_LOCATION);
      this.NEW_SELECTED_LOCATION = this.USER_CURRENT_LOCATION;
      console.log(this.NEW_SELECTED_LOCATION);
  }
}
