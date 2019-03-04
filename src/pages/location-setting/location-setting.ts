import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the LocationSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location-setting',
  templateUrl: 'location-setting.html',
})
export class LocationSettingPage {
  LOCATIONTYPES = [] ;
  LOCATIONTYPESSET =[];
  TEMP_LOCATIONTYPES = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private dbService: DbService,
    private appService: AppService
    ) {
      // this.LOCATION_SETS = this.localService.LOCATION_SETS;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationSettingPage');
    this.LOCATIONTYPES = this.localService.LOCATIONTYPES;
    // this.getLocationTypes()
    this.getLocationTypeSettings();
  }

  getLocationTypes() {
    this.TEMP_LOCATIONTYPES =[];
    this.dbService.getAllLocationTypes()
      .then((res: any[]) => {
        console.log(res);
        this.TEMP_LOCATIONTYPES = res;
        // this.getLocationTypeSettings();
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      })
  }

  refresh(){
    this.LOCATIONTYPES = []
    this.TEMP_LOCATIONTYPES.forEach(LOC=>{
      LOC['isSet'] = this.checkIfSet(LOC.LocationTypeID);
      this.LOCATIONTYPES.push(LOC);
    })
    console.log(this.LOCATIONTYPES);
  }

  getLocationTypeSettings(){
    this.LOCATIONTYPESSET =[];
    this.dbService.locationTypeSettingsGet(this.localService.USER.Email)
    .then((res: any)=>{
      console.log(res);
      this.LOCATIONTYPESSET = res;
      this.getLocationTypes()
    })
    .catch(err => {
      console.log(err);
    })

  }

  toggleLocation(LOCATION){
    console.log(LOCATION);
    LOCATION.isSet = ! LOCATION.isSet
    // let LOC = this.LOCATIONTYPESSET[0];
    // LOC.LocationTypeID = LOCATION.LocationTypeID
    // this.LOCATIONTYPESSET.push(LOC);
    // console.log(this.LOCATIONTYPESSET);
    // this.refresh();
  }

  checkIfSet(ID){
    let index = this.LOCATIONTYPESSET.map(LOC=> LOC.TypeLocation).indexOf(ID);
    if(index<0) return false
    return true;
  }

  saveConf(){
    console.log(this.LOCATIONTYPES);
    // this.localService.LOCATION_SETS = this.LOCATION_SETS;
    let str =''
    this.LOCATIONTYPES.forEach(LOC=>{
      if(LOC.isSet){
        str +=LOC.LocationTypeID+';'
      }
    })
    str = str.slice(0,-1)
    console.log(str);
    this.dbService.locationTypeSetUpdate(this.localService.USER.Email, this.localService.USER.Phone, str)
    .then((res)=>{
      console.log(res);
      this.appService.presentToast('Thành công',5000);
      this.navCtrl.setRoot('MapPage');
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  

}
