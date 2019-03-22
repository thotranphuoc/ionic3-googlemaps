import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  LatLng
} from '@ionic-native/google-maps';
import { iPosition } from '../../interfaces/position.interface';
import { GmapService } from '../../services/gmap.service';
import { LoadingService } from '../../services/loading.service';
import { iLocation } from '../../interfaces/location.interface';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AutoCompleteModalPage } from '../auto-complete-modal/auto-complete-modal';
import { AutoCompleteTwoModalPage } from '../auto-complete-two-modal/auto-complete-two-modal';
import { Storage } from '@ionic/storage';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-mapx',
  templateUrl: 'mapx.html',
})
export class MapxPage {

  googleMap: GoogleMap;
  map: any;
  marker: any;
  location: MyLocation;
  latLng: LatLng;
  MAP_ZOOM = 15;
  MAKERS_LOADED: boolean = false;
  LOCATIONS = [];
  LOCATIONS_ = [];
  FILTER_LOCATIONS = [];
  LOCATIONTYPESSET = [];
  USER_CURRENT_LOCATION: iPosition;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private gmapService: GmapService,
    private loadingService: LoadingService,
    private dbService: DbService,
    private localService: LocalService,
    private storage: Storage
  ) {
    console.log('constructor');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapNewPage');
    this.getCurrentLocation().then((location: MyLocation) => {
      this.latLng = location.latLng;
      this.USER_CURRENT_LOCATION = { lat: this.latLng.lat, lng: this.latLng.lng };
      this.localService.USER_CURRENT_LOCATION = this.USER_CURRENT_LOCATION;
      this.startInitMap(this.USER_CURRENT_LOCATION);
    })
      .catch(err => {
        console.log(err);
      })
  }

  getCurrentLocation() {
    this.googleMap = this.loadMap();
    return this.googleMap.getMyLocation()
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
    return GoogleMaps.create('mapx', OPTION);
  }

  // getMyLocation() {
  //   return this.googleMap.getMyLocation()
  // }

  // moveMap2Location(map: GoogleMap, location: MyLocation) {
  //   return this.googleMap.animateCamera({
  //     target: location.latLng,
  //     zoom: 17,
  //   })
  // }

  // markerAdd(map: GoogleMap, latLng: LatLng) {
  //   this.marker = map.addMarkerSync({
  //     title: 'Chọn vị trí',
  //     snippet: 'Vị trí bạn chọn',
  //     position: latLng,
  //     animation: GoogleMapsAnimation.BOUNCE
  //   });
  // }

  // showMarker() {
  //   this.marker.showInfoWindow();
  //   this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((e: Event) => {
  //     console.log(e);
  //   })
  // }

  startInitMap(POS: iPosition) {
    this.loadingService.startLoading();
    setTimeout(() => {
      let mapEl = document.getElementById('mapx_main');
      this.initMap(mapEl, POS)
    }, 1000)

  }

  initMap(mapElement: HTMLElement, POS: iPosition) {
    if (POS) {
      this.showMap(POS, mapElement);
    }
    // else {
    //   this.gmapService.getCurrentLocation()
    //     .then((position: iPosition) => {
    //       console.log(position);
    //       this.USER_LOCATION = position;
    //       this.showMap(this.USER_LOCATION, mapElement);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    // }
  }

  showMap(position: iPosition, mapElement: any) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: this.MAP_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }
    this.loadingService.startLoading();
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        this.gmapService.addBlueDotToMap(this.map, mapOptions.center);
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.loadingService.hideLoading();
          this.addMarker(this.map, this.localService.USER_CURRENT_LOCATION);
          if (this.LOCATIONS.length > 0) {
            this.loadLocation2Map(this.FILTER_LOCATIONS);
          } else {
            this.getLocationsx().then(() => {
              this.loadLocation2Map(this.FILTER_LOCATIONS);
            })
          }
        })
      })
  }

  loadLocation2Map(LOCATIONS: iLocation[]) {
    console.log("show maps");
    console.log(LOCATIONS);
    if (LOCATIONS.length > 0) {
      if (!this.MAKERS_LOADED) {
        this.MAKERS_LOADED = true;
        LOCATIONS.forEach(LOCATION => {
          let POS: iPosition = { lat: Number(LOCATION.Latitude), lng: Number(LOCATION.Longitude) };
          this.gmapService.addMarkerWithImageToMapWithIDReturnPromiseWithMarker(this.map, POS, LOCATION);
        })
      } else {
        console.log('markers loaded');
      }

    } else {
      console.log('this.localService.SHOPs_LOCATION = 0');
    }
  }

  getLocationsx() {
    return new Promise((resolve, reject) => {
      this.dbService.getLocations()
        .then((res: any) => {
          console.log('Location get');
          console.log(res);
          this.LOCATIONS = res;
          this.LOCATIONS_ = Object.assign({}, this.LOCATIONS);
          this.localService.LOCATIONS = this.LOCATIONS;
          if (this.LOCATIONTYPESSET.length > 0) {
            this.FILTER_LOCATIONS = this.LOCATIONS.filter(LOC => this.LOCATIONTYPESSET.map(L => L.TypeLocation).indexOf(LOC.LocationTypeID) >= 0);
          } else {
            this.FILTER_LOCATIONS = this.LOCATIONS;
          }
          console.log(this.FILTER_LOCATIONS);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }

  updateSearch() {
    console.log('updateSearch');
    let modal = this.modalCtrl.create(AutoCompleteModalPage);
    let me = this;
    modal.onDidDismiss(data => {
      // this.address.place = data;
      console.log(data);
      if (typeof (data) !== 'undefined' && data) {
        this.map.setCenter(data.latLng);
        this.map.setZoom(17)
        this.addMarker(this.map, data.latLng);
        console.log(this.LOCATIONS);
        this.loadLocation2Map(this.LOCATIONS);
      }
    });
    modal.present();
  }


  addMarker(map: any, POSITION: iPosition) {
    if (typeof (this.marker) !== 'undefined') {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: POSITION,
      map: map,
      title: 'Bạn đang ở đây'
    });
  }

  //Search directions between two location
  searchDirections() {
    console.log('updateSearch');
    let modal = this.modalCtrl.create(AutoCompleteTwoModalPage);
    let me = this;
    modal.onDidDismiss((data: any) => {
      console.log(data);
      if (typeof (data) !== 'undefined' && data) {
        this.gmapService.drawDirection(this.map, data.From.latLng, data.To.latLng).then((res) => {
          console.log(res);
        })
          .catch(err => {
            console.log(err);
          })
        this.map.setCenter(data.From.latLng);
        this.map.setZoom(17)
      }
    });

    modal.present();
  }

  go2AddLoc() {
    if (this.localService.USER) {
      this.navCtrl.push('LocationAddPage', { USER_CURRENT_LOCATION: this.USER_CURRENT_LOCATION });
    } else {
      this.showConfirm();
    }
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      // title: 'Use this lightsaber?',
      message: 'Vui lòng đăng nhập để dùng tính năng này.',
      buttons: [
        {
          text: 'Huỷ bỏ',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Chấp nhận',
          handler: () => {
            console.log('Agree clicked');
            this.navCtrl.push('LoginPage', { isBack: true });
          }
        }
      ]
    });
    confirm.present();
  }

  showInfo() {
    console.log('show info')
    if (this.localService.USER) {
      this.presentActionSheet();
    } else {
      this.showConfirm();
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Xin chào: ' + this.localService.USER.FullName,
      buttons: [
        {
          text: 'Thông tin cá nhân',
          handler: () => {
            console.log('Thông tin cá nhân');
            this.navCtrl.push('ProfileUpdatePage');
          }
        },
        {
          text: 'Quà tặng và giải thưởng',
          handler: () => {
            console.log('Quà tặng và giải thưởng');
            this.navCtrl.push('GiftPage');
          }
        },
        {
          text: 'Danh sách địa điểm cập nhật',
          handler: () => {
            console.log('Danh sách địa điểm cập nhật');
            this.navCtrl.push('LocationHistoryPage');
          }
        },
        {
          text: 'Hiển thị theo loại công trình',
          // role: 'destructive',
          handler: () => {
            console.log('Hiển thị theo loại công trình');
            this.navCtrl.push('LocationSettingPage');
          }
        },

        {
          text: 'Giới thiệu',
          handler: () => {
            console.log('Giới thiệu');
            this.navCtrl.push('InformationPage');
          }
        },

        {
          text: 'Giúp đỡ',
          handler: () => {
            console.log('Giúp đỡ');
            this.navCtrl.push('DmapHelpPage');
          }
        },
        {
          text: 'Đăng xuất',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.localService.USER = null;
            this.storage.set("Username", '');
            this.storage.set("Password", '');
            this.navCtrl.push('LoginPage');
          }
        }
      ]
    });

    actionSheet.present();
  }
}
