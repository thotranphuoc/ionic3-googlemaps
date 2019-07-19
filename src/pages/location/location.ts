import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { LangService } from '../../services/lang.service';

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Location Detail', VI : 'Chi tiết địa điểm'},
    btnDirect : { EN: 'Direct', VI : 'Chỉ đường'},
    lblAddress : { EN: 'Address', VI : 'Địa chỉ'},
    lblPhone : { EN: 'Phone Location', VI : 'Điện thoại công trình'},
    lblUser : { EN: 'User Update', VI : 'Người cập nhật'},
    lblLevel : { EN: 'Level', VI : 'Cấp'},
    lblInformation : { EN: 'Location information (green: approaching PWD, red: not yet approaching PWD, yellow: N/A)', VI : 'Thông tin địa điểm (màu xanh: tiếp cận NKT, màu đỏ: chưa tiếp cận NKT, màu vàng: Không cần thiết)'},
    lblGateway : { EN: 'Gateway', VI : 'Lối vào'},
    lblDoor : { EN: 'Door', VI : 'Cửa'},
    lblTableWork : { EN: 'Table work', VI : 'Bàn làm việc'},
    lblElevator : { EN: 'Elevator', VI : 'Thang máy'},
    lblToilet : { EN: 'Toilet', VI : 'Nhà vệ sinh'},
    lblParking : { EN: 'Parking', VI : 'Bãi đỗ xe'},
    lblNote : { EN: 'Note', VI : 'Ghi chú'},
    btnComment : { EN: 'Comment', VI : 'Bình luận'},
    btnRequestEditing : { EN: 'Request editing', VI : 'Yêu cầu chỉnh sửa'},
  };
  pageId = 'LocationPage';
  data;
  ID: any;
  LOCATION: any = null;
  COMMENTS = [];
  //VALIDATIONS = [false, false, false, false, false, false];
  VALIDATIONS = [0, 0, 0, 0, 0, 0];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService,
    private langService: LangService,
    ) {
      
      this.data = navParams.data;
      console.log(this.data);
      
      if(typeof(this.data.LOCATION) =='undefined'){
        this.navCtrl.setRoot('MapxPage');
      }else{
        this.ID = this.data.LOCATION.LocationID;
      }
      console.log(this.ID);
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
    console.log('ionViewDidLoad LocationPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);
    this.getLocation(this.ID);
    this.getComments();
    this.getValidation(this.ID);
  }

  getComments(){
    let ID = this.ID
    //this.COMMENTS = [];
    this.dbService.commentsGet(ID)
    .then((res: any)=>{
      console.log(res);
      this.COMMENTS = res;
    })
    console.log(this.COMMENTS);
  }

  getLocation(ID: string){
    this.dbService.getLocation(ID)
    .then((res: any[])=>{
      console.log(res);
      this.LOCATION = res[0];
    })
    .catch(err=>{
      console.log(err);
    })
  }

  go2CommentAdd(){
    this.navCtrl.push('CommentAddPage', {LocationID: this.ID});
  }

  go2RequestEdit(){
    this.navCtrl.push('RequestEditPage', {LOCATION: this.data.LOCATION});
  }

  go2MapRoute(){
    this.navCtrl.push('MapRoutePage', {LOCATION: this.LOCATION});
  }
  

  getValidation(ID){
    this.dbService.locationValidationDetailGet(ID).then((res: any[])=>{
      console.log(res);
      let VALID = res;
      VALID.forEach(V=>{
        let index = Number(V.ACType_ID_Ref)-1;
        let result=0;
        console.log('V: ',V);
        if(V.Answer=="Yes")
          result=1;
        else
          if(V.Answer=="N\/A")
            result=2;
        this.VALIDATIONS[index]= result;
      })
      console.log('v2',this.VALIDATIONS);
    })
    .catch(err=>{
      console.log(err);
    })
  } 
}
