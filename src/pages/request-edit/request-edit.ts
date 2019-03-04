import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { iUser } from '../../interfaces/user.interface';
import { iLocation } from '../../interfaces/location.interface';
/**
 * Generated class for the RequestEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-edit',
  templateUrl: 'request-edit.html',
})
export class RequestEditPage {
  data;
  //LOCATION_: iLocation;
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
    User_Phone: '',
    LocationType_Ref: 0,
    Star: '0'
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private dbService: DbService,
    private appService: AppService
    
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Request Edit Page');
    //this.LOCATION_ = this.navParams.data.LOCATION;
    //console.log(this.LOCATION_);
    this.LOCATION.TempID=this.navParams.data.LOCATION.LocationID;
    this.LOCATION.Latitude= this.navParams.data.LOCATION.Latitude;
    this.LOCATION.Longitude= this.navParams.data.LOCATION.Longitude;
    this.LOCATION.Title= this.navParams.data.LOCATION.Title;
    this.LOCATION.Address= this.navParams.data.LOCATION.Address;
    this.LOCATION.Phone= this.navParams.data.LOCATION.Phone;
    this.LOCATION.User_Phone= this.navParams.data.LOCATION.User_Phone;
    this.LOCATION.LocationType_Ref= this.navParams.data.LOCATION.LocationType_Ref;
    this.LOCATION.Star= this.navParams.data.LOCATION.Star;
    this.getQuestionTypes();
    this.getLocationTypes();
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

  selectQuestionType(qt){
    console.log(qt);
    this.getQuestionsOfType(qt.id);
  }

  getQuestionsOfType(ID){
    console.log(ID);
    let index = this.QUESTIONTYPES.map(q=> q.id).indexOf(ID);
    console.log(index);
    this.QUESTIONTYPES.splice(index,1);
    this.dbService.getAllQuestionsOfType(ID)
    .then((res: any[]) => {
      console.log(res);
      this.QUESTIONS = res;
      this.TYPES +=ID + ';'
      this.navCtrl.push('LocationQuestionPage',{QUESTIONS: res});
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

  send2Admin(){
    console.log(this.LOCATION)
    if( this.checkIfFullFill() ){
      this.doSend2Admin(1);
    }else{
      this.appService.showAlert('Lỗi', 'Xin vui lòng điền đầy đủ thông tin');
    }
  }

  save(){
    console.log(this.LOCATION)
    if( this.checkIfFullFill() ){
      this.doSend2Admin(0);
    }else{
      this.appService.showAlert('Lỗi', 'Xin vui lòng điền đầy đủ thông tin');
    }
  }

  doSend2Admin(active: any) {
    console.log(this.LOCATION);
    console.log('Star: ' + this.LOCATION.Star);
    console.log(this.TYPES, this.localService.STRING);
    if(this.localService.USER){
      this.dbService.locationNewAdd(this.LOCATION.Latitude,this.LOCATION.Longitude,this.LOCATION.Title,this.LOCATION.Address,this.LOCATION.Phone, this.LOCATION.User_Phone, this.LOCATION.LocationType_Ref,this.TYPES, this.LOCATION.Star, this.localService.STRING , active)
      .then((res) => {
        console.log(res);
        return this.updateScoreAndLevel()
      })
      .then((res)=>{
        console.log(res);
        this.appService.presentToast('Thành công', 5000)
        this.navCtrl.setRoot('MapPage');
      })
      .catch(err => {
        console.log(err);
      })
    }else{
      this.go2Login();
    }

  }

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

  go2Login(){
    this.navCtrl.push('LoginPage',{isBack: true});
  }

  updateScoreAndLevel(){
    let USER: iUser = this.localService.USER;
    let p1 = this.dbService.levelUpdate(USER.Email, USER.Level);
    let p2 = this.dbService.scoreUpdate(USER.Email, USER.Score);
    Promise.all([p1,p1]).then((res)=>{
      console.log(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  checkIfFullFill(){
    let i = 0;
    if(this.LOCATION.Address.trim().length<1) return false;
    if(this.LOCATION.Latitude.toString().trim().length<1) return false;
    if(this.LOCATION.Longitude.toString().trim().length<1) return false;
    if(this.LOCATION.Phone.trim().length<1) return false;
    if(this.LOCATION.Star.trim().length<1) return false;
    if(this.LOCATION.Title.trim().length<1) return false;
    if(this.LOCATION.User_Phone.trim().length<1) return false;
    if(this.TYPES.trim().length<1) return false;
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
