import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { LangService } from '../../services/lang.service';
import { DbService } from '../../services/db.service';

/**
 * Generated class for the GiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift',
  templateUrl: 'gift.html',
})
export class GiftPage {
// FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Prize', VI : 'Giải thưởng'},
    Link : { EN: 'https://www.drdvietnam.org/bandotiepcan/uploads/gift.php', VI : 'https://www.drdvietnam.org/bandotiepcan/uploads/gift.php'},
  };
  pageId = 'GiftPage';

  INFORMATION: any = null;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private langService: LangService,
    private dbService: DbService
    ) {
    //this.getInformation("2");
    //this.ionViewDidLoad();
    //this.INFORMATION['content_vn']='';
    //this.INFORMATION['content_en']='';
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
    console.log('ionViewDidLoad GiftPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);
  }

  getInformation(ID: string){
    this.dbService.getInformation(ID)
    .then((res: any[])=>{
      console.log(res);
      this.INFORMATION = res[0];
    })
    .catch(err=>{
      console.log(err);
    })
  }

}
