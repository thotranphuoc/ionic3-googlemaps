import { Component, NgZone, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, Platform, ModalController, } from 'ionic-angular';
import { LoadingService } from '../../services/loading.service';
import { iPosition } from '../../interfaces/position.interface';
import { GmapService } from '../../services/gmap.service';
import { DbServiceMain } from '../../services/db.service.main';
import { iLocation } from '../../interfaces/location.interface';
import { LocalService } from '../../services/local.service';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppService } from '../../services/app.service';
// import { GoogleMap } from '@agm/core/services/google-maps-types';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Keyboard } from '@ionic-native/keyboard';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions
} from '@ionic-native/google-maps';
import { AutoCompleteModalPage } from '../auto-complete-modal/auto-complete-modal';
import { AutoCompleteTwoModalPage } from '../auto-complete-two-modal/auto-complete-two-modal';
import { LangService } from '../../services/lang.service';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    placeholderSearch : { EN: 'Search here', VI : 'Tìm địa điểm'},
    lblHello : { EN: 'Hello', VI : 'Xin chào'},
    btnInformation : { EN: 'Personal information', VI : 'Thông tin cá nhân'},
    btnGift : { EN: 'Go with D.Map Contest', VI : 'Giải thưởng và thể lệ cuộc thi'},
    btnYourLocation : { EN: 'List of your updated places', VI : 'Danh sách địa điểm cập nhật'},
    btnTypeLocation : { EN: 'Show types of location and place', VI : 'Hiển thị theo loại công trình'},
    btnIntroduction : { EN: 'About D.Map', VI : 'Giới thiệu'},
    btnHelp : { EN: 'Help', VI : 'Giúp đỡ'},
    btnLang : { EN: 'Tiếng Việt', VI : 'English'},
    btnLogout : { EN: 'Log out', VI : 'Đăng xuất'},
  };
  pageId = 'MapPage';

  @ViewChild('searchbar') searchBar;
  autocompleteItems: any;
  autocomplete: any = {
    query: ''
  };
  acService: any;

  data: any;
  mapEl: any;
  map: any;
  // USER_LOCATION: iPosition = { lat: 10.37211, lng: 106.453621 };
  USER_LOCATION: iPosition = null;
  MAP_ZOOM: number = 10;
  MAKERS_LOADED: boolean = false;
  LOCATIONS = [];
  LOCATIONS_ = [];
  FILTER_LOCATIONS = [];
  LOCATIONTYPESSET = [];

  CITIES = [
    { type: 'radio', label: 'Hồ Chí Minh', value: '1', lat: 10.780482, lng: 106.70223, checked: false },
    { type: 'radio', label: 'Hà Nội', value: '2', lat: 21.022736, lng: 105.8019441, checked: false },
    { type: 'radio', label: 'Hải Phòng', value: '3', lat: 20.8467333, lng: 106.6637271, checked: false },
    { type: 'radio', label: 'Đà Lạt', value: '9', lat: 11.933444, lng: 108.457862, checked: false },
    { type: 'radio', label: 'Huế', value: '4', lat: 16.4533875, lng: 107.5420936, checked: false },
    { type: 'radio', label: 'Đà Nẵng', value: '5', lat: 16.0471659, lng: 108.1716865, checked: false },
    { type: 'radio', label: 'Cần Thơ', value: '6', lat: 10.0341851, lng: 105.7225508, checked: false },
    { type: 'radio', label: 'Bình Định', value: '7', lat: 14.1026697, lng: 108.4191822, checked: false },
    { type: 'radio', label: 'Tây Ninh', value: '8', lat: 11.3658548, lng: 106.059613, checked: false },
    { type: 'radio', label: 'Bảo Lộc', value: '10', lat: 11.573068, lng: 107.833079, checked: false },
    { type: 'radio', label: 'Đức Trọng', value: '12', lat: 11.754742, lng: 108.406100, checked: false },
    { type: 'radio', label: 'Vũng Tàu', value: '11', lat: 10.410626, lng: 107.132917, checked: false },
  ]

  googleMap: GoogleMap;
  marker: any;
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingService: LoadingService,
    private gmapService: GmapService,
    private dbService: DbServiceMain,
    private localService: LocalService,
    private appService: AppService,
    public viewCtrl: ViewController,
    private langService: LangService,
    //private keyboard: Keyboard,

  ) {
    this.ionViewDidLoad();
    this.platform.ready().then(() => {
      // this.getGeolocation();
      this.getCurrentLocation();
    })
    .catch(err=>{
      console.log(err);
    })
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
    console.log('ionViewDidLoad MapPage');
    // this.startInitMap();
    // this.getLocations();
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);

    this.getLocationTypeSettings();
    this.locationHandle();

    
  }

  getCurrentLocation(){
    console.log('googleMap',this.googleMap)
    // this.googleMap.getMyLocation()
    // .then((location: MyLocation)=>{
    //   let MSG = location.latLng.lat.toString() + location.latLng.lng.toString();
    //   this.appService.showAlert('Success', MSG)
    // })
    // .catch(err=>{
    //   this.appService.showAlert('error', err.json())
    //   console.log(err);
    // })
    this.initializeMapGeo();
  }

  initializeMapGeo(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.googleMap = GoogleMaps.create('map_geo', mapOptions);
    this.googleMap.getMyLocation().then((location: MyLocation)=>{
      // this.appService.showAlert('Success', location.latLng.lat.toString()+ '-' + location.latLng.lng.toString() );
      console.log(location.latLng.lat.toString()+ '-' + location.latLng.lng.toString() );
      this.startInitMap();
    })
    .catch((err: any)=>{
      this.appService.showAlert('Error',err.message);
      console.log(err.message)
    })
  }

  // searchAddress()
  // {
  //   //load Places Autocomplete
  //   /*this.mapsAPILoader.load().then(() => {
  //     let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
  //     let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
  //         types: ["address"]
  //     });
  //     autocomplete.addListener("place_changed", () => {
  //         this.ngZone.run(() => {
  //             //get the place result
  //             /*let place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //             //verify result
  //             if (place.geometry === undefined || place.geometry === null) {
  //                 return;
  //             }

  //             //set latitude, longitude and zoom
  //             this.latitude = place.geometry.location.lat();
  //             this.longitude = place.geometry.location.lng();
  //             //this.zoom = 12;

  //         });
  //     });
  // });*/
  // }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((res) => {
      console.log(res);
      let POS: iPosition = { lat: res.coords.latitude, lng: res.coords.longitude };
      this.USER_LOCATION = POS;
      this.startInitMap();
    })
      .catch((err) => {
        console.log(err);
        let POS: iPosition = { lat: 10.780482, lng: 106.70223 };
        this.USER_LOCATION = POS;
        this.startInitMap();
        alert(err.message);
      })
  }

  startInitMap() {
    this.loadingService.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)

  }

  initMap(mapElement) {
    if (this.USER_LOCATION) {
      this.showMap(this.USER_LOCATION, mapElement);
    } else {
      this.gmapService.getCurrentLocation()
        .then((position: iPosition) => {
          console.log(position);
          this.USER_LOCATION = position;
          this.showMap(this.USER_LOCATION, mapElement);
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
      zoom: this.MAP_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        this.gmapService.addBlueDotToMap(this.map, mapOptions.center);
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.loadingService.hideLoading();
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

  // getLocations(){
  //   this.geolocation.getCurrentPosition().then(res=>{
  //     console.log(res);
  //     this.appService.showAlert('latLng','lat:' + res.coords.latitude.toString() + 'lng: ' +res.coords.longitude.toString())
  //   }).catch(err=>{
  //     this.appService.showAlert('latLng', err.message);
  //   })
  // }

  // getCurrentLocation(){
  //   this.gMap = GoogleMaps.create('map', {
  //     camera: {
  //       target: {
  //         lat: 43.0741704,
  //         lng: -89.3809802
  //       },
  //       zoom: 18,
  //       tilt: 30
  //     }
  //   });
  //   this.gMap.getMyLocation().then((location: MyLocation)=>{
  //     let result = JSON.stringify(location, null, 2)
  //     console.log(result);
  //     this.appService.showAlert('Result', result);
  //   }).catch((err)=>{
  //     console.log(err);
  //     this.appService.showAlert('Error', err.message);
  //   })
  // }

  getLocationsx() {
    return new Promise((resolve, reject) => {
      this.dbService.getLocations()
        .then((res: any) => {
          console.log('Location get');
          console.log(res);
          this.LOCATIONS = res;
          this.LOCATIONS_ = res;
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

  // DE LAM GI
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

  loadLocation2Map(LOCATIONS: iLocation[]) {
    console.log("show maps");
    console.log(LOCATIONS);
    if (LOCATIONS.length > 0) {
      if (!this.MAKERS_LOADED) {
        this.MAKERS_LOADED = true;
        // LOCATIONS.map(LOCATION =>{
        //   let img0: string = LOCATION.SHOP_IMAGE_URL.toString();
        //   let img1: string = img0.replace('_0?alt=media&token=', '_1?alt=media&token=');
        //   LOCATION['SHOP_IMAGES'] = [img0,img1];
        // });
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

  go2AddLoc() {
    if (this.localService.USER) {
      this.navCtrl.push('LocationAddPage');
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


  checkIfUserSigned() {
    this.localService.USER
    return
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
            this.localService.USER = null;
            this.navCtrl.push('LoginPage');
          }
        }
      ]
    });

    actionSheet.present();
  }

  locationHandle() {
    if (this.localService.USER && this.localService.USER.lat !== '0' && this.localService.USER.lng !== '0') {
      this.USER_LOCATION = { lat: Number(this.localService.USER.lat), lng: Number(this.localService.USER.lng) };
      this.startInitMap();
      this.localService.USER_CURRENT_LOCATION = this.USER_LOCATION;
    } else {
      this.showRadio();
    }
  }
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Chọn tỉnh thành:');
    this.CITIES.forEach(CITY => {
      alert.addInput({ type: CITY.type, label: CITY.label, value: CITY.value, checked: CITY.checked })
    })
    // alert.addInput({ type: 'radio', label: 'Hồ Chí Minh', value: '1', checked: true });
    // alert.addInput({ type: 'radio', label: 'Hà Nội', value: '2', checked: false });
    // alert.addInput({ type: 'radio', label: 'Hải Phòng', value: '3', checked: false });
    // alert.addInput({ type: 'radio', label: 'Huế', value: '4', checked: false });
    // alert.addInput({ type: 'radio', label: 'Đà Nẵng', value: '5', checked: false });
    // alert.addInput({ type: 'radio', label: 'Cần Thơ', value: '6', checked: false });
    // alert.addInput({ type: 'radio', label: 'Bình Định', value: '7', checked: false });
    // alert.addInput({ type: 'radio', label: 'Tây Ninh', value: '8', checked: false });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.updateLocation(data);
      }
    });
    alert.present();
  }

  updateLocation(ID) {
    let index = this.CITIES.map(CITY => CITY.value).indexOf(ID)
    this.USER_LOCATION = { lat: this.CITIES[index].lat, lng: this.CITIES[index].lng };
    this.localService.USER_CURRENT_LOCATION = this.USER_LOCATION;
    this.startInitMap();
    if (this.localService.USER) {
      this.dbService.locationUserSet(this.localService.USER.Email, this.USER_LOCATION.lat, this.USER_LOCATION.lng)
        .then((res) => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  search(e) {
    console.log(e);
    let str = e.toLowerCase();
    console.log(str);
    console.log(this.FILTER_LOCATIONS);
    if (str.length > 0) {
      this.FILTER_LOCATIONS = this.LOCATIONS.filter(LOC => LOC.Address.toLowerCase().indexOf(str) > -1)
    } else {
      console.log('str = 0');
      this.FILTER_LOCATIONS = this.LOCATIONS_;
    }

    console.log(this.FILTER_LOCATIONS.length);
    //this.loadLocation2Map(this.FILTER_LOCATIONS) 

    //this.showMap(this.USER_LOCATION, mapElement);
  }


  ngOnInit() {

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  // updateSearch() {
  //   if (this.autocomplete.query == '') {
  //     this.autocompleteItems = [];
  //     return;
  //   }
  //   let self = this;
  //   let config = {
  //     types: ['address'], // other types available in the API: 'establishment', 'regions', and 'cities'
  //     input: this.autocomplete.query
  //   };
  //   this.acService.getPlacePredictions(config, function (predictions, status) {
  //     self.autocompleteItems = [];
  //     if (predictions) {
  //       predictions.forEach(function (prediction) {
  //         self.autocompleteItems.push(prediction);
  //       });
  //     }
  //     else {
  //       console.log('no predictions');
  //     }
  //   });
  // }

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
      title: 'You here'
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

}



