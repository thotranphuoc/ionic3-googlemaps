import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { iLocation } from '../../interfaces/location.interface';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the LocationHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location-history',
  templateUrl: 'location-history.html',
})
export class LocationHistoryPage {
  pet = 'history';
  LOCATIONS_HIS = [];
  LOCATIONS_TEMP = [];
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
    private dbService: DbService,
    private localService: LocalService,
    private appService: AppService
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationHistoryPage');
    this.getLocations();
    this.getTempLocations();
  }

  getLocations(){
    let email = this.localService.USER.Email;
    this.dbService.locationOfUserGet(email).then((res: any)=>{
      console.log(res);
      this.LOCATIONS_HIS = res;
    })
  }

  getTempLocations(){
    let email = this.localService.USER.Email;
    this.dbService.locationTempOfUserGet(email).then((res: any)=>{
      console.log(res);
      this.LOCATIONS_TEMP = res;
    })
  }

  setLocations(LOCATION:iLOC){
    console.log(LOCATION)
    this.doSend2Admin(LOCATION.TempID);
  }

  doSend2Admin(LocationID: any) {
    console.log(this.LOCATION);
  
    if(this.localService.USER){
      this.dbService.locationNewAddActive(LocationID)
      .then((res)=>{
        console.log(res);
        this.appService.presentToast('Thành công', 5000)
        this.navCtrl.setRoot('LocationHistoryPage');
      })
      .catch(err => {
        console.log(err);
      })
    }else{
      this.go2Login();
    }
  }

  setAllLocations(){
    console.log();
    this.doSendAll2Admin(this.localService.USER.Phone);
  }

  doSendAll2Admin(Phone: any) {
    console.log(this.LOCATION);
  
    if(this.localService.USER){
      this.dbService.locationNewAddAllActive(Phone)
      .then((res)=>{
        console.log(res);
        this.appService.presentToast('Thành công', 5000)
        this.navCtrl.setRoot('LocationHistoryPage');
      })
      .catch(err => {
        console.log(err);
      })
    }else{
      this.go2Login();
    }
  }

  go2Login(){
    this.navCtrl.push('LoginPage',{isBack: true});
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
