import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { LangService } from '../../services/lang.service';

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
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Location Type', VI : 'Loại công trình'},
    btnShow : { EN: 'Show', VI : 'Hiển thị'},
    btnHide : { EN: 'Hide', VI : 'Ẩn'},
    btnSave : { EN: 'Save', VI : 'Lưu'},
    btnLocationName : { EN: 'LOCATION.Name_en', VI : 'LOCATION.Name'},
  };
  pageId = 'LocationSettingPage';

  LOCATIONTYPES = [] ;
  LOCATIONTYPESSET =[];
  TEMP_LOCATIONTYPES = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private dbService: DbService,
    private appService: AppService,
    private langService: LangService
    ) {
      // this.LOCATION_SETS = this.localService.LOCATION_SETS;
    this.ionViewDidLoad();
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
    console.log('ionViewDidLoad LocationSettingPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);

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
      this.navCtrl.setRoot('MapxPage');
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  

}
