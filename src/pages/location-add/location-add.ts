import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { iLocation } from '../../interfaces/location.interface';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import { iUser } from '../../interfaces/user.interface';
import { AppService } from '../../services/app.service';
import { iPosition } from '../../interfaces/position.interface';

@IonicPage()
@Component({
  selector: 'page-location-add',
  templateUrl: 'location-add.html',
})
export class LocationAddPage {
  // LOCATION: iLocation;
  QUESTIONTYPES: any[] = [];
  QUESTIONS: any[] = [];
  LOCATIONTYPES: any[] = [];
  TYPES = '';
  LOCATION: iLOC = {
    TempID: '',
    Latitude: '',
    Longitude: '',
    Title: '',
    Address: '',
    Phone: '',
    User_Phone: this.localService.USER.Phone,
    LocationType_Ref: 0,
    Star: '0'
  }
  data: any;
  USER_CURRENT_LOCATION: iPosition;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private dbService: DbService,
    private appService: AppService,
    private event: Events

  ) {
    // this.LOCATION = this.localService.LOCATION_DEFAULT
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationAddPage');
    this.getQuestionTypes();
    this.getLocationTypes();
    this.data = this.navParams.data;
    this.USER_CURRENT_LOCATION = this.data.USER_CURRENT_LOCATION;
    if (typeof (this.USER_CURRENT_LOCATION) !== 'undefined') {
      this.LOCATION.Latitude = this.USER_CURRENT_LOCATION.lat.toString();
      this.LOCATION.Longitude = this.USER_CURRENT_LOCATION.lng.toString();
    } else {
      this.LOCATION
    }
  }

  getQuestionTypes() {
    this.dbService.getAllQuestionTypes()
      .then((res: any[]) => {
        console.log(res);
        this.QUESTIONTYPES = res;
      })
      .catch(err => {
        console.log(err);
      })
  }

  selectQuestionType(qt) {
    console.log(qt);
    this.getQuestionsOfType(qt.id);
  }

  getQuestionsOfType(ID) {
    console.log(ID);
    let index = this.QUESTIONTYPES.map(q => q.id).indexOf(ID);
    console.log(index);
    this.QUESTIONTYPES.splice(index, 1);
    this.dbService.getAllQuestionsOfType(ID)
      .then((res: any[]) => {
        console.log(res);
        this.QUESTIONS = res;
        this.TYPES += ID + ';'
        this.navCtrl.push('LocationQuestionPage', { QUESTIONS: res });
      })
      .catch(err => {
        console.log(err);
      })
  }

  getLocationTypes() {
    this.dbService.getAllLocationTypes()
      .then((res: any[]) => {
        console.log(res);
        this.LOCATIONTYPES = res;
      })
      .catch(err => {
        console.log(err);
      })
  }

  send2Admin() {
    console.log(this.LOCATION)
    if (this.checkIfFullFill()) {
      this.doSend2Admin(1);
    } else {
      this.appService.showAlert('Lỗi', 'Xin vui lòng điền đầy đủ thông tin');
    }
  }

  save() {
    console.log(this.LOCATION)
    if (this.checkIfFullFill()) {
      this.doSend2Admin(0);
    } else {
      this.appService.showAlert('Lỗi', 'Xin vui lòng điền đầy đủ thông tin');
    }
  }

  doSend2Admin(active: any) {
    console.log(this.LOCATION);
    console.log('Star: ' + this.LOCATION.Star);
    console.log(this.TYPES, this.localService.STRING);
    if (this.localService.USER) {
      this.dbService.locationNewAdd(this.LOCATION.Latitude, this.LOCATION.Longitude, this.LOCATION.Title, this.LOCATION.Address, this.LOCATION.Phone, this.LOCATION.User_Phone, this.LOCATION.LocationType_Ref, this.TYPES, this.LOCATION.Star, this.localService.STRING, active)
        .then((res) => {
          console.log(res);
          return this.updateScoreAndLevel()
        })
        .then((res) => {
          console.log(res);
          this.appService.presentToast('Thành công', 5000)
          this.navCtrl.setRoot('MapPage');
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.go2Login();
    }

  }

  // updateLocation() {
  //   let CURRENT_LOCATION = this.localService.USER_CURRENT_LOCATION;
  //   let mapModal = this.modalCtrl.create('LocationSetNewPage', { CURRENT_LOCATION: CURRENT_LOCATION });
  //   mapModal.onDidDismiss((data: any) => {
  //     console.log(data);
  //     // if (data) {
  //     //   this.SHOP.SHOP_LOCATION = data.NEW_LOCATION;
  //     // }
  //     if (data.NEW_LOCATION) {
  //       this.LOCATION.Latitude = data.NEW_LOCATION.lat;
  //       this.LOCATION.Longitude = data.NEW_LOCATION.lng;
  //     }
  //   })
  //   mapModal.present();
  // }

  // native map for location set
  // updateLocation() {
    // let sub: any
    // let CURRENT_LOCATION = this.localService.USER_CURRENT_LOCATION;
    // this.navCtrl.push('LocationSetNewPage', { CURRENT_LOCATION: CURRENT_LOCATION });
    //  this.event.subscribe('on-location-set', (data: any) => {
    //   console.log(data);
    //   if (data) {
    //     this.LOCATION.Latitude = data.NEW_LOCATION.lat;
    //     this.LOCATION.Longitude = data.NEW_LOCATION.lng;
    //   }
    //   this.event.unsubscribe('on-location-set');
    //   if(typeof(sub) !=='undefined'){
    //     sub.unsubscribe();
    //   }

    // })
  // }

  updateLocation() {
    let CURRENT_LOCATION = this.localService.USER_CURRENT_LOCATION;
    let mapModal = this.modalCtrl.create('LocationSetPage', { CURRENT_LOCATION: CURRENT_LOCATION });
    mapModal.onDidDismiss((data: any) => {
      console.log(data);
      // if (data) {
      //   this.SHOP.SHOP_LOCATION = data.NEW_LOCATION;
      // }
      if (data.NEW_LOCATION) {
        this.LOCATION.Latitude = data.NEW_LOCATION.lat;
        this.LOCATION.Longitude = data.NEW_LOCATION.lng;
      }
    })
    mapModal.present();
  }

  selectLocation(loc) {
    console.log(loc);
    this.LOCATION.LocationType_Ref = loc.LocationTypeID;
  }

  go2Login() {
    this.navCtrl.push('LoginPage', { isBack: true });
  }

  updateScoreAndLevel() {
    let USER: iUser = this.localService.USER;
    let p1 = this.dbService.levelUpdate(USER.Email, USER.Level);
    let p2 = this.dbService.scoreUpdate(USER.Email, USER.Score);
    Promise.all([p1, p1]).then((res) => {
      console.log(res);
    })
      .catch(err => {
        console.log(err);
      })
  }

  checkIfFullFill() {
    let i = 0;
    if (this.LOCATION.Address.trim().length < 1) return false;
    if (this.LOCATION.Latitude.toString().trim().length < 1) return false;
    if (this.LOCATION.Longitude.toString().trim().length < 1) return false;
    if (this.LOCATION.Phone.trim().length < 1) return false;
    if (this.LOCATION.Star.trim().length < 1) return false;
    if (this.LOCATION.Title.trim().length < 1) return false;
    if (this.LOCATION.User_Phone.trim().length < 1) return false;
    if (this.TYPES.trim().length < 1) return false;
    return true;
  }

}

export interface iLOC {
  TempID: string,
  Latitude: string,
  Longitude: string,
  Title: string,
  Address: string,
  Phone: string,
  User_Phone: string,
  LocationType_Ref: number, // Location ID
  Star: string
}
