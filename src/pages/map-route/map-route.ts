import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GmapService } from '../../services/gmap.service';
import { iLocation } from '../../interfaces/location.interface';
import { iPosition } from '../../interfaces/position.interface';
import { LoadingService } from '../../services/loading.service';
import { iLOC } from '../location-add/location-add';
import { LocalService } from '../../services/local.service';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map-route',
  templateUrl: 'map-route.html',
})
export class MapRoutePage {
  LOCATION: iLocation;
  LOCATIONS: iLocation[] = [];
  map: any;
  loading: any;
  mapEl: any;
  userMarker: any;
  isOrigMarkerLoaded: boolean = false;
  USER_CURRENT_LOCATION: iPosition = null;
  DestinationPos: iPosition;
  isLoaded = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gmapService: GmapService,
    private loadingService: LoadingService,
    private localService: LocalService
  ) {
    this.LOCATION = this.navParams.get('LOCATION');
    this.LOCATIONS = this.localService.LOCATIONS
    this.DestinationPos = { lat: Number(this.LOCATION.Latitude), lng: Number(this.LOCATION.Longitude) };
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.mapEl = document.getElementById('map2');
      this.initMap(this.mapEl)
    }, 1500)

    console.log('ionViewDidLoad MapRoutePage');
    // this.gmapService.getCurrentLocation().then((res: any)=>{
    //   this.USER_CURRENT_LOCATION = res;
    //   this.DestinationPos = {lat: Number(this.LOCATION.Latitude), lng: Number(this.LOCATION.Longitude)}
    //   this.gmapService.drawDirection(this.map, this.USER_CURRENT_LOCATION, this.DestinationPos)
    //   .then((res)=>{
    //     console.log(res);
    //   })
    //   .catch((err)=>{
    //     console.log(err);
    //   })
    // })
  }

  initMap(mapElement) {
    console.log('start initMap()')
    if (this.USER_CURRENT_LOCATION && this.USER_CURRENT_LOCATION.lat !== 0 && this.USER_CURRENT_LOCATION.lng !== 0) {
      console.log('user location set');
      console.log(this.USER_CURRENT_LOCATION)
      this.showMap(this.USER_CURRENT_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      this.gmapService.getCurrentLocation()
        .then((pos: iPosition) => {
          console.log(pos);
          this.USER_CURRENT_LOCATION = pos;
          this.showMap(this.USER_CURRENT_LOCATION, mapElement);
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
          if (!this.isLoaded) {
            this.drawRoute();
            // if (!this.isOrigMarkerLoaded) {
            //   this.addMarker(this.DestinationPos);
            //   // this.NEW_SELECTED_LOCATION = position;
            //   this.isOrigMarkerLoaded = true;
            // }

            this.LOCATIONS.forEach(LOCATION => {
              let POS: iPosition = { lat: Number(LOCATION.Latitude), lng: Number(LOCATION.Longitude) };
              this.gmapService.addMarkerWithImageToMapWithIDReturnPromiseWithMarkerWithoutRoute2Location(this.map, POS, LOCATION);
            })
            this.isLoaded = true;
          }
        })

        // google.maps.event.addListener(this.map, 'click', (event) => {
        //   this.userMarker.setMap(null);
        //   let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
        //   console.log(positionClick);
        //   this.addMarker(positionClick);
        //   this.NEW_SELECTED_LOCATION = positionClick;
        //   this.isOrigMarkerLoaded = true;
        // })



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
      title: 'Dữ liệu mới',
      // draggable: true
    })

    // this.userMarker.addListener('dragend', (event) => {
    //   console.log(event);
    //   let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    //   console.log(positionClick);
    //   this.NEW_SELECTED_LOCATION = positionClick;
    //   this.isOrigMarkerLoaded = true;
    // })
  }

  drawRoute() {
    this.gmapService.drawDirection(this.map, this.USER_CURRENT_LOCATION, this.DestinationPos)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }
}
