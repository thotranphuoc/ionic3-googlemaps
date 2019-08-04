import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ActionSheetController, ViewController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
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
import { LangService } from '../../services/lang.service';
declare var google: any;
declare var window: any;

@IonicPage()
@Component({
  selector: 'page-mapx',
  templateUrl: 'mapx.html',
})
export class MapxPage {
// FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    placeholderSearch : { EN: 'Search here', VI : 'Tìm địa điểm'},
    lblHello : { EN: 'Hello', VI : 'Xin chào'},
    btnInformation : { EN: 'Personal information', VI : 'Thông tin cá nhân'},
    btnDetails : { EN: 'Details', VI : 'Xem chi tiết'},
    btnGift : { EN: 'Go with D.Map Contest', VI : 'Giải thưởng và thể lệ cuộc thi'},
    btnYourLocation : { EN: 'List of your updated places', VI : 'Danh sách địa điểm cập nhật'},
    btnTypeLocation : { EN: 'Show types of location and place', VI : 'Hiển thị theo loại công trình'},
    btnIntroduction : { EN: 'About D.Map', VI : 'Giới thiệu'},
    btnHelp : { EN: 'Help', VI : 'Giúp đỡ'},
    btnLang : { EN: 'Tiếng Việt', VI : 'English'},
    btnLogout : { EN: 'Log out', VI : 'Đăng xuất'},
  };
  pageId = 'MapxPage';

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
    private storage: Storage,
    private langService: LangService,
    protected viewCtrl:ViewController,
  ) {
    console.log('constructor');
    
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
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);
    if (!window.cordova) {
      console.log('cordova is not available');
      let lat = 10.7891915;
      let lng = 106.7405075;
      this.USER_CURRENT_LOCATION = { lat: lat, lng: lng };
      this.localService.USER_CURRENT_LOCATION = this.USER_CURRENT_LOCATION;
      this.startInitMap(this.USER_CURRENT_LOCATION);
    } else {
      this.getCurrentLocation().then((location: MyLocation) => {
        this.latLng = location.latLng;
        this.USER_CURRENT_LOCATION = { lat: this.latLng.lat, lng: this.latLng.lng };
        this.localService.USER_CURRENT_LOCATION = this.USER_CURRENT_LOCATION;
        this.startInitMap(this.USER_CURRENT_LOCATION);
      })
        .catch(err => {
          console.log(err);
          // this.latLng = location.latLng;
          let lat = 10.7891915;
          let lng = 106.7405075;
          this.USER_CURRENT_LOCATION = { lat: lat, lng: lng };
          this.localService.USER_CURRENT_LOCATION = this.USER_CURRENT_LOCATION;
          this.startInitMap(this.USER_CURRENT_LOCATION);
        })
    }

    
    this.getLocationTypeSettings();
  }

  getCurrentLocation() {
    this.googleMap = this.loadMap();
    return this.googleMap.getMyLocation()
  }

  loadMap_() {
    let OPTION = {
      target: {
        lat: 43.0741704,
        lng: -89.3809802
      },
      zoom: 18,
      tilt: 30
    }
    this.addCluster();
    return GoogleMaps.create('mapx', OPTION);
  }

  loadMap() {
    console.log('loadmap', this.LOCATIONS)
    this.map = GoogleMaps.create('mapx', {
      'camera': {
        'target': {
          "lat": 10.7891915,
          "lng": 106.7405075
        },
        'zoom': 10
      }
    });
    this.addCluster();
    return this.map;
  }

  addCluster() {
    //this.LOCATIONS=this.dummyData1();
    console.log('Cluster', this.LOCATIONS);
    this.map.addMarkerCluster({
      markers: this.LOCATIONS,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    }).then((markerCluster: MarkerCluster) =>{
      console.log('test 2',markerCluster);
      markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
        let marker: Marker = params[1];
        marker.setTitle(marker.get("name"));
        marker.setSnippet(marker.get("address"));
        marker.showInfoWindow();
      });
    })

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
            //this.loadLocation2Map(this.FILTER_LOCATIONS);
            this.dbService.getLocations_location().then((res: any) => {
              this.LOCATIONS = res;
              console.log('res',this.LOCATIONS);
              this.loadMap();
            }).catch();
          } else {
            this.getLocationsx_loc(position).then(() => {
              this.dbService.getLocations_location().then((res: any) => {
                this.LOCATIONS = res;
                console.log('res',this.LOCATIONS);
                this.loadMap();
              }).catch();
              //this.loadLocation2Map(this.FILTER_LOCATIONS);
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
            console.log('Locationtype',this.LOCATIONTYPESSET);
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

  getLocationsx_loc(POS:iPosition) {
    return new Promise((resolve, reject) => {
      this.dbService.getLocations_loc(POS)
        .then((res: any) => {
          console.log('Location get');
          console.log(res);
          this.LOCATIONS = res;
          this.LOCATIONS_ = Object.assign({}, this.LOCATIONS);
          this.localService.LOCATIONS = this.LOCATIONS;
          if (this.LOCATIONTYPESSET.length > 0) {
            console.log('Locationtype',this.LOCATIONTYPESSET);
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

  // Get các loại địa điểm cần show
  getLocationTypeSettings() {
    this.LOCATIONTYPESSET = [];
    let email = null;
    if (this.localService.USER) {
      email = this.localService.USER.Email
    }
    if (this.localService.USER) {
      this.dbService.locationTypeSettingsGet(this.localService.USER.Email)
        .then((res: any) => {
          console.log(res);
          this.LOCATIONTYPESSET = res;
          // this.getLocationTypes();
        })
        .catch(err => {
          console.log(err);
        })
    }

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


  dummyData1() {
    return [
      {
        "position": {
          "lat": 10.780482,
          "lng": 106.70223
        },
        "name": "Bệnh viện nhi đồng 2",
        "address": "14 Lý Tự Trọng, P. Bến Nghé, Q. 1, Tp. HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.779495,
        "lng": 106.68199
        },
        "name": "Bệnh viện da liễu",
        "address": "2 Nguyễn Thông, P. 6, Q. 3, Tp. HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.757663,
        "lng": 106.6587537
        },
        "name": "Bệnh viện Chợ Rẫy",
        "address": "201B Nguyễn Chí Thanh, phường 12, quận 5",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.37211,
        "lng": 106.453621
        },
        "name": "Phòng khám đa khoa Hoà Hảo",
        "address": "254 Hoà Hảo, phường 4, quận 10, HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.7685558,
        "lng": 106.6843567
        },
        "name": "Bệnh viện Từ Dũ",
        "address": "106 Cống Quỳnh, Phạm Ngũ Lão, Quận 1, TP. HCM",
        "icon": "assets/markercluster/marker.png"
        }
    ]
  }

  

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.LANGUAGES.lblHello[this.LANG] +': ' + this.localService.USER.FullName,
      buttons: [
        {
          text: this.LANGUAGES.btnInformation[this.LANG],
          handler: () => {
            console.log('Thông tin cá nhân');
            this.navCtrl.push('ProfileUpdatePage');
          }
        },
        {
          text: this.LANGUAGES.btnGift[this.LANG],
          handler: () => {
            console.log('Quà tặng và giải thưởng');
            this.navCtrl.push('GiftPage');
          }
        },
        {
          text: this.LANGUAGES.btnYourLocation[this.LANG],
          handler: () => {
            console.log('Danh sách địa điểm cập nhật');
            this.navCtrl.push('LocationHistoryPage');
          }
        },
        {
          text: this.LANGUAGES.btnTypeLocation[this.LANG],
          // role: 'destructive',
          handler: () => {
            console.log('Hiển thị theo loại công trình');
            this.navCtrl.push('LocationSettingPage');
          }
        },

        {
          text: this.LANGUAGES.btnIntroduction[this.LANG],
          handler: () => {
            console.log('Giới thiệu');
            this.navCtrl.push('InformationPage');
          }
        },

        {
          text: this.LANGUAGES.btnHelp[this.LANG],
          handler: () => {
            console.log('Giúp đỡ');
            this.navCtrl.push('DmapHelpPage');
          }
        },
        {
          text: this.LANGUAGES.btnLang[this.LANG],
          handler: () => {
            console.log('Giúp đỡ');
            //this.navCtrl.push('DmapHelpPage');
            if(this.LANG=='EN')
            {
              this.langService.LANG='VI';
              this.LANG='VI';
            }
            else{
              this.langService.LANG='EN';
              this.LANG='EN';
            }
          }
        },
        {
          text: this.LANGUAGES.btnLogout[this.LANG],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            //this.localService.USER = null;
            //this.navCtrl.push('LoginPage');
            //this.viewCtrl.dismiss();
          }
        }
      ]
    });

    actionSheet.present();
  }
}

