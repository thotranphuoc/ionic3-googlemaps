import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { iLocation } from '../../interfaces/location.interface';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';
import { LangService } from '../../services/lang.service';

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
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Your updated places', VI : 'Địa điểm cập nhật'},
    btnLocationUpdate : { EN: 'Updated places', VI : 'Địa điểm cập nhật'},
    btnLocationSave : { EN: 'Processing places', VI : 'Địa điểm đã lưu'},
    placeholderLocationName : { EN: 'Name', VI : 'Tên'},
    placeholderAddress : { EN: 'Address', VI : 'Địa chỉ'},
    placeholderPhoneLocation : { EN: 'Contact number', VI : 'Điện thoại'},
    
    btnEdit : { EN: 'Edit', VI : 'Chỉnh sửa'},
    btnSentAll : { EN: 'Send All', VI : 'Gửi tất cả'},
    btnSentAdmin : { EN: 'Send', VI : 'Gửi Admin'},
    txtNote : { EN: 'Note: Only use when your location is changed', VI : 'Chú ý: Chỉ sử dụng khi vị trí thay đổi.'},
  };
  pageId = 'LocationHistoryPage';

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
    private appService: AppService,
    private langService: LangService
    ) {
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
    console.log('ionViewDidLoad LocationHistoryPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);

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
  editLocations(LOCATION:iLOC){
    console.log(LOCATION)
    //this.doSend2Admin(LOCATION.TempID);
    this.navCtrl.push('RequestEditPage', {LOCATION: LOCATION});
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
